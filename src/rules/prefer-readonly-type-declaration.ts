import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { ReadonlynessOptions } from "@typescript-eslint/type-utils";
import {
  readonlynessOptionsDefaults,
  readonlynessOptionsSchema,
} from "@typescript-eslint/type-utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";

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
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
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

// The name of this rule.
export const name = "prefer-readonly-type-declaration" as const;

// The options this rule can take.
type Options = AllowLocalMutationOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnorePatternOption & {
    readonly functionReturnTypes: "ignore" | "immutable";
    readonly ignoreAliasPatterns: ReadonlyArray<string> | string;
    readonly ignoreCollections: boolean;
    readonly mutableAliasPatterns: ReadonlyArray<string> | string;
    readonly readonlyAliasPatterns: ReadonlyArray<string> | string;
    readonly readonlynessOptions: ReadonlynessOptions;
  };

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepmerge(
    allowLocalMutationOptionSchema,
    ignorePatternOptionSchema,
    ignoreClassOptionSchema,
    ignoreInterfaceOptionSchema,
    {
      type: "object",
      properties: {
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
      },
      additionalProperties: false,
    }
  ),
];

// The default options for the rule.
const defaultOptions: Options = {
  ignoreClass: false,
  ignoreInterface: false,
  ignoreCollections: false,
  allowLocalMutation: false,
  functionReturnTypes: "ignore",
  readonlyAliasPatterns: "^(?!I?Mutable).+$",
  mutableAliasPatterns: "^I?Mutable.+$",
  ignoreAliasPatterns: "^Mutable$",
  readonlynessOptions: readonlynessOptionsDefaults,
};

// The possible error messages.
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

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
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
    Array.isArray(options.ignoreAliasPatterns)
      ? options.ignoreAliasPatterns
      : [options.ignoreAliasPatterns]
  ).map((pattern) => new RegExp(pattern, "u"));

  const blacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(node.id.name)
  );

  if (blacklisted) {
    return TypeReadonlynessDetails.IGNORE;
  }

  const mustBeReadonlyPatterns = (
    Array.isArray(options.readonlyAliasPatterns)
      ? options.readonlyAliasPatterns
      : [options.readonlyAliasPatterns]
  ).map((pattern) => new RegExp(pattern, "u"));

  const mustBeMutablePatterns = (
    Array.isArray(options.mutableAliasPatterns)
      ? options.mutableAliasPatterns
      : [options.mutableAliasPatterns]
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
    options.readonlynessOptions
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
  if (
    shouldIgnoreClass(node, context, options) ||
    shouldIgnoreInterface(node, context, options) ||
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
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
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    options.ignoreCollections ||
    shouldIgnoreClass(node, context, options) ||
    shouldIgnoreInterface(node, context, options) ||
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
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
          (options.functionReturnTypes === "immutable" || !isInReturnType(node))
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
  if (
    shouldIgnoreClass(node, context, options) ||
    shouldIgnoreInterface(node, context, options) ||
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
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
  node: TSESTree.TSTypeReference,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    !isIdentifier(node.typeName) ||
    (options.ignoreCollections && mutableTypeRegex.test(node.typeName.name)) ||
    shouldIgnoreClass(node, context, options) ||
    shouldIgnoreInterface(node, context, options) ||
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
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
          (options.functionReturnTypes === "ignore" && isInReturnType(node))
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
    | TSESTree.PropertyDefinition
    | TSESTree.TSIndexSignature
    | TSESTree.TSParameterProperty
    | TSESTree.TSPropertySignature,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    shouldIgnoreClass(node, context, options) ||
    shouldIgnoreInterface(node, context, options) ||
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
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
          (options.functionReturnTypes === "immutable" || !isInReturnType(node))
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
