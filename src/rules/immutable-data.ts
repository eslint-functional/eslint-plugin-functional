import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type {
  IgnoreAccessorPatternOption,
  IgnorePatternOption,
  IgnoreClassOption,
} from "~/common/ignore-options";
import {
  shouldIgnorePattern,
  shouldIgnoreClass,
  ignoreAccessorPatternOptionSchema,
  ignoreClassOptionSchema,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import { isExpected } from "~/util/misc";
import { createRule, getTypeOfNode } from "~/util/rule";
import type { RuleResult } from "~/util/rule";
import { inConstructor } from "~/util/tree";
import {
  isArrayConstructorType,
  isArrayExpression,
  isArrayType,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
  isObjectConstructorType,
} from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "immutable-data" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  IgnoreAccessorPatternOption &
    IgnoreClassOption &
    IgnorePatternOption &
    Readonly<{
      ignoreImmediateMutation: boolean;
      assumeTypes:
        | boolean
        | Readonly<{
            forArrays: boolean;
            forObjects: boolean;
          }>;
    }>
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(
      ignorePatternOptionSchema,
      ignoreAccessorPatternOptionSchema,
      ignoreClassOptionSchema,
      {
        ignoreImmediateMutation: {
          type: "boolean",
        },
        assumeTypes: {
          oneOf: [
            {
              type: "boolean",
            },
            {
              type: "object",
              properties: {
                forArrays: {
                  type: "boolean",
                },
                forObjects: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
          ],
        },
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
    ignoreImmediateMutation: true,
    assumeTypes: {
      forArrays: true,
      forObjects: true,
    },
  },
];

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
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce treating data as immutable.",
    recommended: "error",
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
const arrayNewObjectReturningMethods = [
  "concat",
  "slice",
  "filter",
  "map",
  "reduce",
  "reduceRight",
];

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
const objectConstructorMutatorFunctions = new Set([
  "assign",
  "defineProperties",
  "defineProperty",
  "setPrototypeOf",
]);

/**
 * Check if the given assignment expression violates this rule.
 */
function checkAssignmentExpression(
  node: ReadonlyDeep<TSESTree.AssignmentExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    !isMemberExpression(node.left) ||
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors:
      // Allow if in a constructor - allow for field initialization.
      !inConstructor(node) ? [{ node, messageId: "generic" }] : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUnaryExpression(
  node: ReadonlyDeep<TSESTree.UnaryExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors:
      node.operator === "delete" ? [{ node, messageId: "generic" }] : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: ReadonlyDeep<TSESTree.UpdateExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClass(node.argument, context, optionsObject) ||
    shouldIgnorePattern(node.argument, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
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
  node: ReadonlyDeep<TSESTree.MemberExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  assumeArrayTypes: boolean
): boolean {
  return (
    // Check for: [0, 1, 2]
    isArrayExpression(node.object) ||
    // Check for: new Array()
    (isNewExpression(node.object) &&
      isArrayConstructorType(
        // `isNewExpression` type guard doesn't seem to be working? so use `as`.
        getTypeOfNode((node.object as TSESTree.NewExpression).callee, context),
        assumeArrayTypes,
        (node.object as TSESTree.NewExpression).callee
      )) ||
    (isCallExpression(node.object) &&
      isMemberExpression(node.object.callee) &&
      isIdentifier(node.object.callee.property) &&
      // Check for: Array.from(iterable)
      ((arrayConstructorFunctions.some(
        isExpected(node.object.callee.property.name)
      ) &&
        isArrayConstructorType(
          getTypeOfNode(node.object.callee.object, context),
          assumeArrayTypes,
          node.object.callee.object
        )) ||
        // Check for: array.slice(0)
        arrayNewObjectReturningMethods.some(
          isExpected(node.object.callee.property.name)
        )))
  );
}

/**
 * Check if the given node violates this rule.
 */
function checkCallExpression(
  node: ReadonlyDeep<TSESTree.CallExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  // Not potential object mutation?
  if (
    !isMemberExpression(node.callee) ||
    !isIdentifier(node.callee.property) ||
    shouldIgnoreClass(node.callee.object, context, optionsObject) ||
    shouldIgnorePattern(node.callee.object, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const { assumeTypes, ignoreImmediateMutation } = optionsObject;

  const assumeTypesForArrays =
    assumeTypes === true ||
    (assumeTypes !== false && assumeTypes.forArrays === true);

  // Array mutation?
  if (
    arrayMutatorMethods.has(node.callee.property.name) &&
    (!ignoreImmediateMutation ||
      !isInChainCallAndFollowsNew(
        node.callee,
        context,
        assumeTypesForArrays
      )) &&
    isArrayType(
      getTypeOfNode(node.callee.object, context),
      assumeTypesForArrays,
      node.callee.object
    )
  ) {
    return {
      context,
      descriptors: [{ node, messageId: "array" }],
    };
  }

  const assumeTypesForObjects =
    assumeTypes === true ||
    (assumeTypes !== false && assumeTypes.forObjects === true);

  // Non-array object mutation (ex. Object.assign on identifier)?
  if (
    objectConstructorMutatorFunctions.has(node.callee.property.name) &&
    node.arguments.length >= 2 &&
    (isIdentifier(node.arguments[0]) ||
      isMemberExpression(node.arguments[0])) &&
    !shouldIgnoreClass(node.arguments[0], context, optionsObject) &&
    !shouldIgnorePattern(node.arguments[0], context, optionsObject) &&
    isObjectConstructorType(
      getTypeOfNode(node.callee.object, context),
      assumeTypesForObjects,
      node.callee.object
    )
  ) {
    return {
      context,
      descriptors: [{ node, messageId: "object" }],
    };
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    AssignmentExpression: checkAssignmentExpression,
    UnaryExpression: checkUnaryExpression,
    UpdateExpression: checkUpdateExpression,
    CallExpression: checkCallExpression,
  }
);
