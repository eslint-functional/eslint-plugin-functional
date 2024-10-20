import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  type IgnoreAccessorPatternOption,
  type IgnoreClassesOption,
  type IgnoreIdentifierPatternOption,
  type OverridableOptions,
  type RawOverridableOptions,
  getCoreOptions,
  ignoreAccessorPatternOptionSchema,
  ignoreClassesOptionSchema,
  ignoreIdentifierPatternOptionSchema,
  shouldIgnoreClasses,
  shouldIgnorePattern,
  upgradeRawOverridableOptions,
} from "#/options";
import { isExpected, ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule, getTypeOfNode } from "#/utils/rule";
import { overridableOptionsSchema } from "#/utils/schemas";
import { findRootIdentifier, isDefinedByMutableVariable, isInConstructor } from "#/utils/tree";
import {
  isArrayConstructorType,
  isArrayExpression,
  isArrayType,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
  isObjectConstructorType,
  isTSAsExpression,
} from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "immutable-data";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

type CoreOptions = IgnoreAccessorPatternOption &
  IgnoreClassesOption &
  IgnoreIdentifierPatternOption & {
    ignoreImmediateMutation: boolean;
    ignoreNonConstDeclarations:
      | boolean
      | {
          treatParametersAsConst: boolean;
        };
  };

/**
 * The options this rule can take.
 */
type RawOptions = [RawOverridableOptions<CoreOptions>];
type Options = OverridableOptions<CoreOptions>;

const coreOptionsPropertiesSchema = deepmerge(
  ignoreIdentifierPatternOptionSchema,
  ignoreAccessorPatternOptionSchema,
  ignoreClassesOptionSchema,
  {
    ignoreImmediateMutation: {
      type: "boolean",
    },
    ignoreNonConstDeclarations: {
      oneOf: [
        {
          type: "boolean",
        },
        {
          type: "object",
          properties: {
            treatParametersAsConst: {
              type: "boolean",
            },
          },
          additionalProperties: false,
        },
      ],
    },
  },
) as NonNullable<JSONSchema4ObjectSchema["properties"]>;

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [overridableOptionsSchema(coreOptionsPropertiesSchema)];

/**
 * The default options for the rule.
 */
const defaultOptions = [
  {
    ignoreClasses: false,
    ignoreImmediateMutation: true,
    ignoreNonConstDeclarations: false,
  },
] satisfies RawOptions;

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Modifying an existing object/array is not allowed.",
  object: "Modifying properties of existing object not allowed.",
  array: "Modifying an array is not allowed.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Enforce treating data as immutable.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  messages: errorMessages,
  schema,
};

/**
 * Array methods that mutate an array.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods#Mutator_methods
 */
const arrayMutatorMethods = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
]);

/**
 * Array methods that return a new object (or array) without mutating the original.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods#Accessor_methods
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Iteration_methods
 */
const arrayNewObjectReturningMethods = ["concat", "slice", "filter", "map", "reduce", "reduceRight"];

/**
 * Array constructor functions that create a new array.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods
 */
const arrayConstructorFunctions = ["from", "of"];

/**
 * Object constructor functions that mutate an object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#Methods_of_the_Object_constructor
 */
const objectConstructorMutatorFunctions = new Set(["assign", "defineProperties", "defineProperty", "setPrototypeOf"]);

/**
 * Object constructor functions that return new objects.
 */
const objectConstructorNewObjectReturningMethods = [
  "create",
  "entries",
  "fromEntries",
  "getOwnPropertyDescriptor",
  "getOwnPropertyDescriptors",
  "getOwnPropertyNames",
  "getOwnPropertySymbols",
  "groupBy",
  "keys",
  "values",
];

/**
 * String constructor functions that return new objects.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Methods
 */
const stringConstructorNewObjectReturningMethods = ["split"];

/**
 * Check if the given assignment expression violates this rule.
 */
function checkAssignmentExpression(
  node: TSESTree.AssignmentExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const rootNode = findRootIdentifier(node.left) ?? node.left;
  const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(rootNode, context, options));

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern, ignoreAccessorPattern, ignoreNonConstDeclarations, ignoreClasses } = optionsToUse;

  if (
    !isMemberExpression(node.left) ||
    shouldIgnoreClasses(node, context, ignoreClasses) ||
    shouldIgnorePattern(node, context, ignoreIdentifierPattern, ignoreAccessorPattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  if (ignoreNonConstDeclarations !== false) {
    const rootIdentifier = findRootIdentifier(node.left.object);
    if (
      rootIdentifier !== undefined &&
      isDefinedByMutableVariable(
        rootIdentifier,
        context,
        (variableNode) =>
          ignoreNonConstDeclarations === true ||
          !ignoreNonConstDeclarations.treatParametersAsConst ||
          shouldIgnorePattern(variableNode, context, ignoreIdentifierPattern, ignoreAccessorPattern),
      )
    ) {
      return {
        context,
        descriptors: [],
      };
    }
  }

  return {
    context,
    descriptors:
      // Allow if in a constructor - allow for field initialization.
      isInConstructor(node) ? [] : [{ node, messageId: "generic" }],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUnaryExpression(
  node: TSESTree.UnaryExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const rootNode = findRootIdentifier(node.argument) ?? node.argument;
  const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(rootNode, context, options));

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern, ignoreAccessorPattern, ignoreNonConstDeclarations, ignoreClasses } = optionsToUse;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClasses(node, context, ignoreClasses) ||
    shouldIgnorePattern(node, context, ignoreIdentifierPattern, ignoreAccessorPattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  if (ignoreNonConstDeclarations !== false) {
    const rootIdentifier = findRootIdentifier(node.argument.object);
    if (
      rootIdentifier !== undefined &&
      isDefinedByMutableVariable(
        rootIdentifier,
        context,
        (variableNode) =>
          ignoreNonConstDeclarations === true ||
          !ignoreNonConstDeclarations.treatParametersAsConst ||
          shouldIgnorePattern(variableNode, context, ignoreIdentifierPattern, ignoreAccessorPattern),
      )
    ) {
      return {
        context,
        descriptors: [],
      };
    }
  }

  return {
    context,
    descriptors: node.operator === "delete" ? [{ node, messageId: "generic" }] : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: TSESTree.UpdateExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const rootNode = findRootIdentifier(node.argument) ?? node.argument;
  const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(rootNode, context, options));

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern, ignoreAccessorPattern, ignoreNonConstDeclarations, ignoreClasses } = optionsToUse;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClasses(node.argument, context, ignoreClasses) ||
    shouldIgnorePattern(node.argument, context, ignoreIdentifierPattern, ignoreAccessorPattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  if (ignoreNonConstDeclarations !== false) {
    const rootIdentifier = findRootIdentifier(node.argument.object);
    if (
      rootIdentifier !== undefined &&
      isDefinedByMutableVariable(
        rootIdentifier,
        context,
        (variableNode) =>
          ignoreNonConstDeclarations === true ||
          !ignoreNonConstDeclarations.treatParametersAsConst ||
          shouldIgnorePattern(variableNode, context, ignoreIdentifierPattern, ignoreAccessorPattern),
      )
    ) {
      return {
        context,
        descriptors: [],
      };
    }
  }

  return {
    context,
    descriptors: [{ node, messageId: "generic" }],
  };
}

/**
 * Check if the given the given MemberExpression is part of a chain and
 * immediately follows a method/function call that returns a new array.
 *
 * If this is the case, then the given MemberExpression is allowed to be
 * a mutator method call.
 */
function isInChainCallAndFollowsNew(
  node: TSESTree.Expression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
): boolean {
  if (isMemberExpression(node)) {
    return isInChainCallAndFollowsNew(node.object, context);
  }

  if (isTSAsExpression(node)) {
    return isInChainCallAndFollowsNew(node.expression, context);
  }

  // Check for: [0, 1, 2]
  if (isArrayExpression(node)) {
    return true;
  }

  // Check for: new Array()
  if (isNewExpression(node) && isArrayConstructorType(context, getTypeOfNode(node.callee, context))) {
    return true;
  }

  if (isCallExpression(node) && isMemberExpression(node.callee) && isIdentifier(node.callee.property)) {
    // Check for: Array.from(iterable)
    if (
      arrayConstructorFunctions.some(isExpected(node.callee.property.name)) &&
      isArrayConstructorType(context, getTypeOfNode(node.callee.object, context))
    ) {
      return true;
    }

    // Check for: array.slice(0)
    if (arrayNewObjectReturningMethods.some(isExpected(node.callee.property.name))) {
      return true;
    }

    // Check for: Object.entries(object)
    if (
      objectConstructorNewObjectReturningMethods.some(isExpected(node.callee.property.name)) &&
      isObjectConstructorType(context, getTypeOfNode(node.callee.object, context))
    ) {
      return true;
    }

    // Check for: "".split("")
    if (
      stringConstructorNewObjectReturningMethods.some(isExpected(node.callee.property.name)) &&
      getTypeOfNode(node.callee.object, context).isStringLiteral()
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Add the default options to the given options.
 */
function getOptionsWithDefaults(options: Readonly<Options> | null): Options | null {
  if (options === null) {
    return null;
  }

  return {
    ...defaultOptions[0],
    ...options,
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const rootNode = findRootIdentifier(node.callee) ?? node.callee;
  const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(rootNode, context, options));

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern, ignoreAccessorPattern, ignoreNonConstDeclarations, ignoreClasses } = optionsToUse;

  // Not potential object mutation?
  if (
    !isMemberExpression(node.callee) ||
    !isIdentifier(node.callee.property) ||
    shouldIgnoreClasses(node.callee.object, context, ignoreClasses) ||
    shouldIgnorePattern(node.callee.object, context, ignoreIdentifierPattern, ignoreAccessorPattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreImmediateMutation } = optionsToUse;

  // Array mutation?
  if (
    arrayMutatorMethods.has(node.callee.property.name) &&
    (!ignoreImmediateMutation || !isInChainCallAndFollowsNew(node.callee, context)) &&
    isArrayType(context, getTypeOfNode(node.callee.object, context))
  ) {
    if (ignoreNonConstDeclarations === false) {
      return {
        context,
        descriptors: [{ node, messageId: "array" }],
      };
    }
    const rootIdentifier = findRootIdentifier(node.callee.object);
    if (
      rootIdentifier === undefined ||
      !isDefinedByMutableVariable(
        rootIdentifier,
        context,
        (variableNode) =>
          ignoreNonConstDeclarations === true ||
          !ignoreNonConstDeclarations.treatParametersAsConst ||
          shouldIgnorePattern(variableNode, context, ignoreIdentifierPattern, ignoreAccessorPattern),
      )
    ) {
      return {
        context,
        descriptors: [{ node, messageId: "array" }],
      };
    }
  }

  // Non-array object mutation (ex. Object.assign on identifier)?
  if (
    objectConstructorMutatorFunctions.has(node.callee.property.name) &&
    node.arguments.length >= 2 &&
    (isIdentifier(node.arguments[0]!) || isMemberExpression(node.arguments[0]!)) &&
    !shouldIgnoreClasses(node.arguments[0], context, ignoreClasses) &&
    !shouldIgnorePattern(node.arguments[0], context, ignoreIdentifierPattern, ignoreAccessorPattern) &&
    isObjectConstructorType(context, getTypeOfNode(node.callee.object, context))
  ) {
    if (ignoreNonConstDeclarations === false) {
      return {
        context,
        descriptors: [{ node, messageId: "object" }],
      };
    }
    const rootIdentifier = findRootIdentifier(node.callee.object);
    if (
      rootIdentifier === undefined ||
      !isDefinedByMutableVariable(
        rootIdentifier,
        context,
        (variableNode) =>
          ignoreNonConstDeclarations === true ||
          !ignoreNonConstDeclarations.treatParametersAsConst ||
          shouldIgnorePattern(variableNode, context, ignoreIdentifierPattern, ignoreAccessorPattern),
      )
    ) {
      return {
        context,
        descriptors: [{ node, messageId: "object" }],
      };
    }
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, RawOptions> = createRule<keyof typeof errorMessages, RawOptions>(
  name,
  meta,
  defaultOptions,
  {
    AssignmentExpression: checkAssignmentExpression,
    UnaryExpression: checkUnaryExpression,
    UpdateExpression: checkUpdateExpression,
    CallExpression: checkCallExpression,
  },
);
