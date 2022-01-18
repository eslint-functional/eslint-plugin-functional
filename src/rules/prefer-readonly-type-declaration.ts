import type { ReadonlynessOptions } from "@typescript-eslint/type-utils";
import {
  readonlynessOptionsDefaults,
  readonlynessOptionsSchema,
} from "@typescript-eslint/type-utils";
import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type {
  AllowLocalMutationOption,
  IgnoreClassOption,
  IgnoreInterfaceOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  shouldIgnoreClass,
  shouldIgnoreInterface,
  shouldIgnoreLocalMutation,
  shouldIgnorePattern,
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignoreInterfaceOptionSchema,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import type { RuleResult } from "~/util/rule";
import { isReadonly, createRule } from "~/util/rule";
import {
  getParentIndexSignature,
  getTypeDeclaration,
  isInReturnType,
} from "~/util/tree";
import {
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

/**
 * The name of this rule.
 */
export const name = "prefer-readonly-type-declaration" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  AllowLocalMutationOption &
    IgnoreClassOption &
    IgnoreInterfaceOption &
    IgnorePatternOption & {
      readonly functionReturnTypes: "ignore" | "immutable";
      readonly ignoreAliasPatterns: ReadonlyArray<string> | string;
      readonly ignoreCollections: boolean;
      readonly mutableAliasPatterns: ReadonlyArray<string> | string;
      readonly readonlyAliasPatterns: ReadonlyArray<string> | string;
      readonly readonlynessOptions: ReadonlynessOptions;
    }
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(
      allowLocalMutationOptionSchema,
      ignorePatternOptionSchema,
      ignoreClassOptionSchema,
      ignoreInterfaceOptionSchema,
      {
        functionReturnTypes: {
          type: "string",
          enum: ["ignore", "immutable"],
        },
        ignoreCollections: {
          type: "boolean",
        },
        ignoreAliasPatterns: {
          type: ["string", "array"],
          items: {
            type: "string",
          },
        },
        readonlyAliasPatterns: {
          type: ["string", "array"],
          items: {
            type: "string",
          },
        },
        mutableAliasPatterns: {
          type: ["string", "array"],
          items: {
            type: "string",
          },
        },
        readonlynessOptions: readonlynessOptionsSchema,
      }
    ),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreClass: false,
    ignoreInterface: false,
    ignoreCollections: false,
    allowLocalMutation: false,
    functionReturnTypes: "ignore",
    readonlyAliasPatterns: "^(?!I?Mutable).+$",
    mutableAliasPatterns: "^I?Mutable.+$",
    ignoreAliasPatterns: "^Mutable$",
    readonlynessOptions: readonlynessOptionsDefaults,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  aliasConfigErrorMutableReadonly:
    "Configuration error - this type must be marked as both readonly and mutable.",
  aliasNeedsExplicitMarking:
    "Type must be explicity marked as either readonly or mutable.",
  aliasShouldBeMutable:
    "Mutable types should not be fully readonly. If this type is supposed to me readonly, mark it as so.",
  aliasShouldBeReadonly:
    "Readonly types should not be mutable at all. If this type is supposed to me mutable, mark it as so.",
  arrayShouldBeReadonly: "Array should be readonly.",
  propertyShouldBeReadonly: "This property should be readonly.",
  tupleShouldBeReadonly: "Tuple should be readonly.",
  typeShouldBeReadonly: "Type should be readonly.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly types over mutable one and enforce patterns.",
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
  | ReadonlyDeep<TSESTree.TSInterfaceDeclaration>
  | ReadonlyDeep<TSESTree.TSTypeAliasDeclaration>,
  TypeReadonlynessDetails
>();

/**
 * Get the details for the given type alias.
 */
function getTypeAliasDeclarationDetails(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): TypeReadonlynessDetails {
  const [optionsObject] = options;
  const { ignoreInterface } = optionsObject;

  const typeDeclaration = getTypeDeclaration(node);
  if (typeDeclaration === null) {
    return TypeReadonlynessDetails.NONE;
  }

  const indexSignature = getParentIndexSignature(node);
  if (indexSignature !== null && getTypeDeclaration(indexSignature) !== null) {
    return TypeReadonlynessDetails.IGNORE;
  }

  if (ignoreInterface && isTSInterfaceDeclaration(typeDeclaration)) {
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
  // eslint-disable-next-line functional/no-expression-statement
  cachedDetails.set(typeDeclaration, result);
  return result;
}

/**
 * Get the details for the given type alias.
 */
function getTypeAliasDeclarationDetailsInternal(
  node:
    | ReadonlyDeep<TSESTree.TSInterfaceDeclaration>
    | ReadonlyDeep<TSESTree.TSTypeAliasDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  [
    {
      ignoreAliasPatterns,
      readonlyAliasPatterns,
      mutableAliasPatterns,
      readonlynessOptions,
    },
  ]: Options
): TypeReadonlynessDetails {
  const blacklistPatterns = (
    Array.isArray(ignoreAliasPatterns)
      ? ignoreAliasPatterns
      : [ignoreAliasPatterns]
  ).map((pattern) => new RegExp(pattern, "u"));

  const blacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (blacklisted) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const mustBeReadonlyPatterns = (
    Array.isArray(readonlyAliasPatterns)
      ? readonlyAliasPatterns
      : [readonlyAliasPatterns]
  ).map((pattern) => new RegExp(pattern, "u"));

  const mustBeMutablePatterns = (
    Array.isArray(mutableAliasPatterns)
      ? mutableAliasPatterns
      : [mutableAliasPatterns]
  ).map((pattern) => new RegExp(pattern, "u"));

  if (
    mustBeReadonlyPatterns.length === 0 &&
    mustBeMutablePatterns.length === 0
  ) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const patternStatesReadonly = mustBeReadonlyPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );
  const patternStatesMutable = mustBeMutablePatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (patternStatesReadonly && patternStatesMutable) {
    return TypeReadonlynessDetails.ERROR_MUTABLE_READONLY;
  }

  const requiredReadonlyness = patternStatesReadonly
    ? RequiredReadonlyness.READONLY
    : patternStatesMutable
    ? RequiredReadonlyness.MUTABLE
    : RequiredReadonlyness.EITHER;

  if (requiredReadonlyness === RequiredReadonlyness.EITHER) {
    if (mustBeReadonlyPatterns.length > 0 && mustBeMutablePatterns.length > 0) {
      return TypeReadonlynessDetails.NEEDS_EXPLICIT_MARKING;
    }

    return TypeReadonlynessDetails.IGNORE;
  }

  const readonly = isReadonly(
    isTSTypeAliasDeclaration(node) ? node.typeAnnotation : node.body,
    context,
    readonlynessOptions
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
  node:
    | ReadonlyDeep<TSESTree.TSInterfaceDeclaration>
    | ReadonlyDeep<TSESTree.TSTypeAliasDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

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
  node: ReadonlyDeep<TSESTree.TSArrayType> | ReadonlyDeep<TSESTree.TSTupleType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreCollections, functionReturnTypes } = optionsObject;

  if (
    ignoreCollections ||
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
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
      return {
        context,
        descriptors:
          (node.parent === undefined ||
            !isTSTypeOperator(node.parent) ||
            node.parent.operator !== "readonly") &&
          (functionReturnTypes === "immutable" || !isInReturnType(node))
            ? [
                {
                  node,
                  messageId: isTSTupleType(node)
                    ? "tupleShouldBeReadonly"
                    : "arrayShouldBeReadonly",
                  fix:
                    node.parent !== undefined && isTSArrayType(node.parent)
                      ? (fixer) => [
                          fixer.insertTextBefore(
                            node as TSESTree.Node,
                            "(readonly "
                          ),
                          fixer.insertTextAfter(node as TSESTree.Node, ")"),
                        ]
                      : (fixer) =>
                          fixer.insertTextBefore(
                            node as TSESTree.Node,
                            "readonly "
                          ),
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
  node: ReadonlyDeep<TSESTree.TSMappedType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
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
  node: ReadonlyDeep<TSESTree.TSTypeReference>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreCollections, functionReturnTypes } = optionsObject;

  if (
    !isIdentifier(node.typeName) ||
    (ignoreCollections && mutableTypeRegex.test(node.typeName.name)) ||
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
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
          (functionReturnTypes === "ignore" && isInReturnType(node))
            ? []
            : [
                {
                  node,
                  messageId: "typeShouldBeReadonly",
                  fix: (fixer) =>
                    fixer.replaceText(
                      node.typeName as TSESTree.Node,
                      immutableType
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
 * Check if the given property/signature node violates this rule.
 */
function checkProperty(
  node:
    | ReadonlyDeep<TSESTree.PropertyDefinition>
    | ReadonlyDeep<TSESTree.TSIndexSignature>
    | ReadonlyDeep<TSESTree.TSParameterProperty>
    | ReadonlyDeep<TSESTree.TSPropertySignature>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { functionReturnTypes } = optionsObject;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
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
      return {
        context,
        descriptors:
          node.readonly !== true &&
          (functionReturnTypes === "immutable" || !isInReturnType(node))
            ? [
                {
                  node,
                  messageId: "propertyShouldBeReadonly",
                  fix:
                    isTSIndexSignature(node) || isTSPropertySignature(node)
                      ? (fixer) =>
                          fixer.insertTextBefore(
                            node as TSESTree.Node,
                            "readonly "
                          )
                      : isTSParameterProperty(node)
                      ? (fixer) =>
                          fixer.insertTextBefore(
                            node.parameter as TSESTree.Node,
                            "readonly "
                          )
                      : (fixer) =>
                          fixer.insertTextBefore(
                            node.key as TSESTree.Node,
                            "readonly "
                          ),
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

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    PropertyDefinition: checkProperty,
    TSArrayType: checkArrayOrTupleType,
    TSIndexSignature: checkProperty,
    TSInterfaceDeclaration: checkTypeDeclaration,
    TSMappedType: checkMappedType,
    TSParameterProperty: checkProperty,
    TSPropertySignature: checkProperty,
    TSTupleType: checkArrayOrTupleType,
    TSTypeAliasDeclaration: checkTypeDeclaration,
    TSTypeReference: checkTypeReference,
  }
);
