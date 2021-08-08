import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";

import type {
  AllowLocalMutationOption,
  IgnoreClassOption,
  IgnoreInterfaceOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignoreInterfaceOptionSchema,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { isReadonly, createRule, getTypeOfNode } from "~/util/rule";
import {
  getParentIndexSignature,
  getTypeDeclaration,
  isInReturnType,
} from "~/util/tree";
import {
  isArrayType,
  isAssignmentPattern,
  isFunctionLike,
  isIdentifier,
  isTSArrayType,
  isTSIndexSignature,
  isTSInterfaceDeclaration,
  isTSParameterProperty,
  isTSPropertySignature,
  isTSTupleType,
  isTSTypeAliasDeclaration,
  isTSTypeOperator,
} from "~/util/typeguard";

// The name of this rule.
export const name = "prefer-readonly-type" as const;

// The options this rule can take.
type Options = AllowLocalMutationOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnorePatternOption & {
    readonly allowMutableReturnType: boolean;
    readonly checkForImplicitMutableArrays: boolean;
    readonly ignoreCollections: boolean;
    readonly aliases: {
      readonly mustBeReadonly: {
        readonly pattern: ReadonlyArray<string> | string;
        readonly requireOthersToBeMutable: boolean;
      };
      readonly mustBeMutable: {
        readonly pattern: ReadonlyArray<string> | string;
        readonly requireOthersToBeReadonly: boolean;
      };
      readonly blacklist: ReadonlyArray<string> | string;
    };
  };

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    allowLocalMutationOptionSchema,
    ignorePatternOptionSchema,
    ignoreClassOptionSchema,
    ignoreInterfaceOptionSchema,
    {
      type: "object",
      properties: {
        allowMutableReturnType: {
          type: "boolean",
        },
        checkForImplicitMutableArrays: {
          type: "boolean",
        },
        ignoreCollections: {
          type: "boolean",
        },
        aliases: {
          type: "object",
          properties: {
            mustBeReadonly: {
              type: "object",
              properties: {
                pattern: {
                  type: ["string", "array"],
                  items: {
                    type: "string",
                  },
                },
                requireOthersToBeMutable: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            mustBeMutable: {
              type: "object",
              properties: {
                pattern: {
                  type: ["string", "array"],
                  items: {
                    type: "string",
                  },
                },
                requireOthersToBeReadonly: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            blacklist: {
              type: "array",
              items: {
                type: ["string", "array"],
                items: {
                  type: "string",
                },
              },
            },
            ignoreInterface: {
              type: "boolean",
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  ]),
];

// The default options for the rule.
const defaultOptions: Options = {
  checkForImplicitMutableArrays: false,
  ignoreClass: false,
  ignoreInterface: false,
  ignoreCollections: false,
  allowLocalMutation: false,
  allowMutableReturnType: true,
  aliases: {
    blacklist: "^Mutable$",
    mustBeReadonly: {
      pattern: "^(I?)Readonly",
      requireOthersToBeMutable: false,
    },
    mustBeMutable: {
      pattern: "^(I?)Mutable",
      requireOthersToBeReadonly: true,
    },
  },
};

// The possible error messages.
const errorMessages = {
  aliasConfigErrorMutableReadonly:
    "Configuration error - this type must be marked as both readonly and mutable.",
  aliasNeedsExplicitMarking:
    "Type must be explicity marked as either readonly or mutable.",
  aliasShouldBeMutable: "Mutable types should not be fully readonly.",
  aliasShouldBeReadonly: "Readonly types should not be mutable at all.",
  arrayShouldBeReadonly: "Array should be readonly.",
  propertyShouldBeReadonly: "This property should be readonly.",
  tupleShouldBeReadonly: "Tuple should be readonly.",
  typeShouldBeReadonly: "Type should be readonly.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly types over mutable one and enforce patterns.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

const mutableToImmutableTypes: ReadonlyMap<string, string> = new Map<
  string,
  string
>([
  ["Array", "ReadonlyArray"],
  ["Map", "ReadonlyMap"],
  ["Set", "ReadonlySet"],
]);
const mutableTypeRegex = new RegExp(
  `^${[...mutableToImmutableTypes.keys()].join("|")}$`,
  "u"
);

const enum RequiredReadonlyness {
  READONLY,
  MUTABLE,
  EITHER,
}

const enum TypeReadonlynessDetails {
  NONE,
  ERROR_MUTABLE_READONLY,
  NEEDS_EXPLICIT_MARKING,
  IGNORE,
  MUTABLE_OK,
  MUTABLE_NOT_OK,
  READONLY_OK,
  READONLY_NOT_OK,
}

const cachedDetails = new WeakMap<
  TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
  TypeReadonlynessDetails
>();

/**
 * Get the details for the given type alias.
 */
function getTypeAliasDeclarationDetails(
  node: TSESTree.Node,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): TypeReadonlynessDetails {
  const typeDeclaration = getTypeDeclaration(node);
  if (typeDeclaration === null) {
    return TypeReadonlynessDetails.NONE;
  }

  const indexSignature = getParentIndexSignature(node);
  if (indexSignature !== null && getTypeDeclaration(indexSignature) !== null) {
    return TypeReadonlynessDetails.IGNORE;
  }

  if (options.ignoreInterface && isTSInterfaceDeclaration(typeDeclaration)) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const cached = cachedDetails.get(typeDeclaration);
  if (cached !== undefined) {
    return cached;
  }

  const result = getTypeAliasDeclarationDetailsInternal(
    typeDeclaration,
    context,
    options
  );
  cachedDetails.set(typeDeclaration, result);
  return result;
}

/**
 * Get the details for the given type alias.
 */
function getTypeAliasDeclarationDetailsInternal(
  node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): TypeReadonlynessDetails {
  const blacklistPatterns = (
    Array.isArray(options.aliases.blacklist)
      ? options.aliases.blacklist
      : [options.aliases.blacklist]
  ).map((pattern) => new RegExp(pattern, "u"));

  const blacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (blacklisted) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const mustBeReadonlyPatterns = (
    Array.isArray(options.aliases.mustBeReadonly.pattern)
      ? options.aliases.mustBeReadonly.pattern
      : [options.aliases.mustBeReadonly.pattern]
  ).map((pattern) => new RegExp(pattern, "u"));

  const mustBeMutablePatterns = (
    Array.isArray(options.aliases.mustBeMutable.pattern)
      ? options.aliases.mustBeMutable.pattern
      : [options.aliases.mustBeMutable.pattern]
  ).map((pattern) => new RegExp(pattern, "u"));

  const patternStatesReadonly = mustBeReadonlyPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );
  const patternStatesMutable = mustBeMutablePatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (patternStatesReadonly && patternStatesMutable) {
    return TypeReadonlynessDetails.ERROR_MUTABLE_READONLY;
  }

  if (
    !patternStatesReadonly &&
    !patternStatesMutable &&
    options.aliases.mustBeReadonly.requireOthersToBeMutable &&
    options.aliases.mustBeMutable.requireOthersToBeReadonly
  ) {
    return TypeReadonlynessDetails.NEEDS_EXPLICIT_MARKING;
  }

  const requiredReadonlyness =
    patternStatesReadonly ||
    (!patternStatesMutable &&
      options.aliases.mustBeMutable.requireOthersToBeReadonly)
      ? RequiredReadonlyness.READONLY
      : patternStatesMutable ||
        (!patternStatesReadonly &&
          options.aliases.mustBeReadonly.requireOthersToBeMutable)
      ? RequiredReadonlyness.MUTABLE
      : RequiredReadonlyness.EITHER;

  if (requiredReadonlyness === RequiredReadonlyness.EITHER) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const readonly = isReadonly(
    isTSTypeAliasDeclaration(node) ? node.typeAnnotation : node.body,
    context
  );

  if (requiredReadonlyness === RequiredReadonlyness.MUTABLE) {
    return readonly
      ? TypeReadonlynessDetails.MUTABLE_NOT_OK
      : TypeReadonlynessDetails.MUTABLE_OK;
  }

  return readonly
    ? TypeReadonlynessDetails.READONLY_OK
    : TypeReadonlynessDetails.READONLY_NOT_OK;
}

/**
 * Check if the given Interface or Type Alias violates this rule.
 */
function checkTypeDeclaration(
  node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const details = getTypeAliasDeclarationDetails(node, context, options);

  switch (details) {
    case TypeReadonlynessDetails.NEEDS_EXPLICIT_MARKING: {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "aliasNeedsExplicitMarking",
          },
        ],
      };
    }
    case TypeReadonlynessDetails.ERROR_MUTABLE_READONLY: {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "aliasConfigErrorMutableReadonly",
          },
        ],
      };
    }
    case TypeReadonlynessDetails.MUTABLE_NOT_OK: {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "aliasShouldBeMutable",
          },
        ],
      };
    }
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors: [
          {
            node: node.id,
            messageId: "aliasShouldBeReadonly",
          },
        ],
      };
    }
    default: {
      return {
        context,
        descriptors: [],
      };
    }
  }
}

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (options.ignoreCollections) {
    return {
      context,
      descriptors: [],
    };
  }

  const aliasDetails = getTypeAliasDeclarationDetails(node, context, options);

  switch (aliasDetails) {
    case TypeReadonlynessDetails.NONE:
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors:
          (node.parent === undefined ||
            !isTSTypeOperator(node.parent) ||
            node.parent.operator !== "readonly") &&
          (!options.allowMutableReturnType || !isInReturnType(node))
            ? [
                {
                  node,
                  messageId: isTSTupleType(node)
                    ? "tupleShouldBeReadonly"
                    : "arrayShouldBeReadonly",
                  fix:
                    node.parent !== undefined && isTSArrayType(node.parent)
                      ? (fixer) => [
                          fixer.insertTextBefore(node, "(readonly "),
                          fixer.insertTextAfter(node, ")"),
                        ]
                      : (fixer) => fixer.insertTextBefore(node, "readonly "),
                },
              ]
            : [],
      };
    }
    default: {
      return {
        context,
        descriptors: [],
      };
    }
  }
}

/**
 * Check if the given TSMappedType violates this rule.
 */
function checkMappedType(
  node: TSESTree.TSMappedType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const aliasDetails = getTypeAliasDeclarationDetails(node, context, options);

  switch (aliasDetails) {
    case TypeReadonlynessDetails.NONE:
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors:
          node.readonly === true || node.readonly === "+"
            ? []
            : [
                {
                  node,
                  messageId: "propertyShouldBeReadonly",
                  fix: (fixer) =>
                    fixer.insertTextBeforeRange(
                      [node.range[0] + 1, node.range[1]],
                      " readonly"
                    ),
                },
              ],
      };
    }
    default: {
      return {
        context,
        descriptors: [],
      };
    }
  }
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkTypeReference(
  node: TSESTree.TSTypeReference,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    !isIdentifier(node.typeName) ||
    (options.ignoreCollections && mutableTypeRegex.test(node.typeName.name))
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const aliasDetails = getTypeAliasDeclarationDetails(node, context, options);

  switch (aliasDetails) {
    case TypeReadonlynessDetails.NONE:
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      const immutableType = mutableToImmutableTypes.get(node.typeName.name);

      return {
        context,
        descriptors:
          immutableType === undefined ||
          immutableType.length === 0 ||
          (options.allowMutableReturnType && isInReturnType(node))
            ? []
            : [
                {
                  node,
                  messageId: "typeShouldBeReadonly",
                  fix: (fixer) =>
                    fixer.replaceText(node.typeName, immutableType),
                },
              ],
      };
    }
    default: {
      return {
        context,
        descriptors: [],
      };
    }
  }
}

/**
 * Check if the given property/signature node violates this rule.
 */
function checkProperty(
  node:
    | TSESTree.ClassProperty
    | TSESTree.TSIndexSignature
    | TSESTree.TSParameterProperty
    | TSESTree.TSPropertySignature,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const aliasDetails = getTypeAliasDeclarationDetails(node, context, options);

  switch (aliasDetails) {
    case TypeReadonlynessDetails.NONE:
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors:
          node.readonly !== true &&
          (!options.allowMutableReturnType || !isInReturnType(node))
            ? [
                {
                  node,
                  messageId: "propertyShouldBeReadonly",
                  fix:
                    isTSIndexSignature(node) || isTSPropertySignature(node)
                      ? (fixer) => fixer.insertTextBefore(node, "readonly ")
                      : isTSParameterProperty(node)
                      ? (fixer) =>
                          fixer.insertTextBefore(node.parameter, "readonly ")
                      : (fixer) =>
                          fixer.insertTextBefore(node.key, "readonly "),
                },
              ]
            : [],
      };
    }
    default: {
      return {
        context,
        descriptors: [],
      };
    }
  }
}

/**
 * Check if the given Implicit Type violates this rule.
 */
function checkForImplicitMutableArray(
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.VariableDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  type Declarator = {
    readonly id: TSESTree.Node;
    readonly init: TSESTree.Node | null;
    readonly node: TSESTree.Node;
  };

  if (
    options.checkForImplicitMutableArrays === false ||
    options.ignoreCollections
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const declarators: ReadonlyArray<Declarator> = isFunctionLike(node)
    ? node.params
        .map((param) =>
          isAssignmentPattern(param)
            ? ({
                id: param.left,
                init: param.right,
                node: param,
              } as Declarator)
            : undefined
        )
        .filter((param): param is Declarator => param !== undefined)
    : node.declarations.map(
        (declaration) =>
          ({
            id: declaration.id,
            init: declaration.init,
            node: declaration,
          } as Declarator)
      );

  return {
    context,
    descriptors: declarators.flatMap((declarator) =>
      isIdentifier(declarator.id) &&
      declarator.id.typeAnnotation === undefined &&
      declarator.init !== null &&
      isArrayType(getTypeOfNode(declarator.init, context))
        ? [
            {
              node: declarator.node,
              messageId: "arrayShouldBeReadonly",
              fix: (fixer) =>
                fixer.insertTextAfter(declarator.id, ": readonly unknown[]"),
            },
          ]
        : []
    ),
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ArrowFunctionExpression: checkForImplicitMutableArray,
    ClassProperty: checkProperty,
    FunctionDeclaration: checkForImplicitMutableArray,
    FunctionExpression: checkForImplicitMutableArray,
    TSArrayType: checkArrayOrTupleType,
    TSIndexSignature: checkProperty,
    TSInterfaceDeclaration: checkTypeDeclaration,
    TSMappedType: checkMappedType,
    TSParameterProperty: checkProperty,
    TSPropertySignature: checkProperty,
    TSTupleType: checkArrayOrTupleType,
    TSTypeAliasDeclaration: checkTypeDeclaration,
    TSTypeReference: checkTypeReference,
    VariableDeclaration: checkForImplicitMutableArray,
  }
);
