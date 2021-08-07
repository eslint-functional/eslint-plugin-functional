import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule, isReadonly } from "~/util/rule";
import { getAncestorOfType } from "~/util/tree";
import {
  isIdentifier,
  isTSArrayType,
  isTSIndexSignature,
  isTSInterfaceDeclaration,
  isTSParameterProperty,
  isTSTupleType,
  isTSTypeAliasDeclaration,
  isTSTypeOperator,
} from "~/util/typeguard";

// The name of this rule.
export const name = "prefer-readonly-type-alias" as const;

const enum RequiredReadonlyness {
  READONLY,
  MUTABLE,
  EITHER,
}

// The options this rule can take.
type Options = {
  readonly mustBeReadonly: {
    readonly pattern: ReadonlyArray<string> | string;
    readonly requireOthersToBeMutable: boolean;
  };
  readonly mustBeMutable: {
    readonly pattern: ReadonlyArray<string> | string;
    readonly requireOthersToBeReadonly: boolean;
  };
  readonly blacklist: ReadonlyArray<string>;
  readonly ignoreInterface: boolean;
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
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
          type: "string",
        },
      },
      ignoreInterface: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
];

// The default options for the rule.
const defaultOptions: Options = {
  mustBeReadonly: {
    pattern: "^(I?)Readonly",
    requireOthersToBeMutable: false,
  },
  mustBeMutable: {
    pattern: "^(I?)Mutable",
    requireOthersToBeReadonly: true,
  },
  blacklist: ["^Mutable$"],
  ignoreInterface: false,
};

// The possible error messages.
const errorMessages = {
  typeAliasShouldBeMutable: "Mutable types should not be fully readonly.",
  typeAliasShouldBeReadonly: "Readonly types should not be mutable at all.",
  typeAliasErrorMutableReadonly:
    "Configuration error - this type must be marked as both readonly and mutable.",
  typeAliasNeedsExplicitMarking:
    "Type must be explicity marked as either readonly or mutable.",
  propertyShouldBeReadonly:
    "A readonly modifier is required for this property.",
  typeShouldBeReadonly: "Type should be readonly.",
  tupleShouldBeReadonly: "Tuple should be readonly.",
  arrayShouldBeReadonly: "Array should be readonly.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly type alias over mutable one.",
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

enum TypeReadonlynessDetails {
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
    return TypeReadonlynessDetails.IGNORE;
  }

  const indexSignature = getParentIndexSignature(node);
  if (indexSignature !== null && getTypeDeclaration(indexSignature) !== null) {
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
    Array.isArray(options.blacklist) ? options.blacklist : [options.blacklist]
  ).map((pattern) => new RegExp(pattern, "u"));

  const blacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (blacklisted) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const mustBeReadonlyPatterns = (
    Array.isArray(options.mustBeReadonly.pattern)
      ? options.mustBeReadonly.pattern
      : [options.mustBeReadonly.pattern]
  ).map((pattern) => new RegExp(pattern, "u"));

  const mustBeMutablePatterns = (
    Array.isArray(options.mustBeMutable.pattern)
      ? options.mustBeMutable.pattern
      : [options.mustBeMutable.pattern]
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
    options.mustBeReadonly.requireOthersToBeMutable &&
    options.mustBeMutable.requireOthersToBeReadonly
  ) {
    return TypeReadonlynessDetails.NEEDS_EXPLICIT_MARKING;
  }

  const requiredReadonlyness =
    patternStatesReadonly ||
    (!patternStatesMutable && options.mustBeMutable.requireOthersToBeReadonly)
      ? RequiredReadonlyness.READONLY
      : patternStatesMutable ||
        (!patternStatesReadonly &&
          options.mustBeReadonly.requireOthersToBeMutable)
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
 * Check if the given TypeReference violates this rule.
 */
function checkTypeAliasDeclaration(
  node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (options.ignoreInterface && isTSInterfaceDeclaration(node)) {
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
            messageId: "typeAliasNeedsExplicitMarking",
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
            messageId: "typeAliasErrorMutableReadonly",
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
            messageId: "typeAliasShouldBeMutable",
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
            messageId: "typeAliasShouldBeReadonly",
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
  const details = getTypeAliasDeclarationDetails(node, context, options);

  switch (details) {
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors:
          node.parent === undefined ||
          !isTSTypeOperator(node.parent) ||
          node.parent.operator !== "readonly"
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
  const details = getTypeAliasDeclarationDetails(node, context, options);

  switch (details) {
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
  if (!isIdentifier(node.typeName)) {
    return {
      context,
      descriptors: [],
    };
  }

  const details = getTypeAliasDeclarationDetails(node, context, options);

  switch (details) {
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      const immutableType = mutableToImmutableTypes.get(node.typeName.name);

      return {
        context,
        descriptors:
          immutableType === undefined || immutableType.length === 0
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
    | TSESTree.TSIndexSignature
    | TSESTree.TSParameterProperty
    | TSESTree.TSPropertySignature,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const details = getTypeAliasDeclarationDetails(node, context, options);

  switch (details) {
    case TypeReadonlynessDetails.READONLY_NOT_OK: {
      return {
        context,
        descriptors:
          node.readonly !== true
            ? [
                {
                  node,
                  messageId: "propertyShouldBeReadonly",
                  fix: isTSParameterProperty(node)
                    ? (fixer) =>
                        fixer.insertTextBefore(node.parameter, "readonly ")
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
 * Get the type alias or interface that the given node is in.
 */
function getTypeDeclaration(
  node: TSESTree.Node
): TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration | null {
  if (isTSTypeAliasDeclaration(node) || isTSInterfaceDeclaration(node)) {
    return node;
  }

  return (getAncestorOfType(
    (n): n is TSESTree.Node =>
      n.parent !== undefined &&
      n.parent !== null &&
      ((isTSTypeAliasDeclaration(n.parent) && n.parent.typeAnnotation === n) ||
        (isTSInterfaceDeclaration(n.parent) && n.parent.body === n)),
    node
  )?.parent ?? null) as
    | TSESTree.TSInterfaceDeclaration
    | TSESTree.TSTypeAliasDeclaration
    | null;
}

/**
 * Get the parent Index Signature that the given node is in.
 */
function getParentIndexSignature(
  node: TSESTree.Node
): TSESTree.TSIndexSignature | null {
  return (getAncestorOfType(
    (n): n is TSESTree.Node =>
      n.parent !== undefined &&
      n.parent !== null &&
      isTSIndexSignature(n.parent) &&
      n.parent.typeAnnotation === n,
    node
  )?.parent ?? null) as TSESTree.TSIndexSignature | null;
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSArrayType: checkArrayOrTupleType,
    TSIndexSignature: checkProperty,
    TSInterfaceDeclaration: checkTypeAliasDeclaration,
    TSMappedType: checkMappedType,
    TSParameterProperty: checkProperty,
    TSPropertySignature: checkProperty,
    TSTupleType: checkArrayOrTupleType,
    TSTypeAliasDeclaration: checkTypeAliasDeclaration,
    TSTypeReference: checkTypeReference,
  }
);
