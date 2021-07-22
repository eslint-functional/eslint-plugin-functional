import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";

import type {
  IgnoreAccessorPatternOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  ignoreAccessorPatternOptionSchema,
  ignorePatternOptionSchema,
  shouldIgnore,
} from "~/common/ignore-options";
import { isExpected } from "~/utils/misc";
import type { RuleContext, RuleMetaData, RuleResult } from "~/utils/rule";
import { createRule, getTypeOfNode } from "~/utils/rule";
import { inConstructor } from "~/utils/tree";
import {
  isArrayConstructorType,
  isArrayExpression,
  isArrayType,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
  isObjectConstructorType,
} from "~/utils/typeguard";

// The name of this rule.
export const name = "immutable-data" as const;

// The options this rule can take.
type Options = IgnorePatternOption &
  IgnoreAccessorPatternOption & {
    readonly ignoreImmediateMutation: boolean;
    readonly assumeTypes:
      | boolean
      | {
          readonly forArrays: boolean;
          readonly forObjects: boolean;
        };
  };

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignorePatternOptionSchema,
    ignoreAccessorPatternOptionSchema,
    {
      type: "object",
      properties: {
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
      },
      additionalProperties: false,
    },
  ]),
];

// The default options for the rule.
const defaultOptions: Options = {
  ignoreImmediateMutation: true,
  assumeTypes: {
    forArrays: true,
    forObjects: true,
  },
};

// The possible error messages.
const errorMessages = {
  generic: "Modifying an existing object/array is not allowed.",
  object: "Modifying properties of existing object not allowed.",
  array: "Modifying an array is not allowed.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce treating data as immutable.",
    category: "Best Practices",
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
const arrayMutatorMethods = [
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
] as const;

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
] as const;

/**
 * Array constructor functions that create a new array.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods
 */
const arrayConstructorFunctions = ["from", "of"] as const;

/**
 * Object constructor functions that mutate an object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#Methods_of_the_Object_constructor
 */
const objectConstructorMutatorFunctions = [
  "assign",
  "defineProperties",
  "defineProperty",
  "setPrototypeOf",
] as const;

/**
 * Check if the given assignment expression violates this rule.
 */
function checkAssignmentExpression(
  node: TSESTree.AssignmentExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      isMemberExpression(node.left) &&
      // Allow if in a constructor - allow for field initialization.
      !inConstructor(node)
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUnaryExpression(
  node: TSESTree.UnaryExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      node.operator === "delete" && isMemberExpression(node.argument)
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: TSESTree.UpdateExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      isMemberExpression(node.argument) &&
      !shouldIgnore(node.argument, context, options)
        ? [{ node, messageId: "generic" }]
        : [],
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
  node: TSESTree.MemberExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
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
  node: TSESTree.CallExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const assumeTypesForArrays =
    options.assumeTypes === true ||
    (options.assumeTypes !== false && options.assumeTypes.forArrays === true);
  const assumeTypesForObjects =
    options.assumeTypes === true ||
    (options.assumeTypes !== false && options.assumeTypes.forObjects === true);

  const isMethodName = (methodName) => {
    return (
      methodName ===
      ((node.callee as TSESTree.MemberExpression)
        .property as TSESTree.Identifier).name
    );
  };

  return {
    context,
    descriptors:
      // Potential object mutation?
      isMemberExpression(node.callee) && isIdentifier(node.callee.property)
        ? // Potential array mutation?
          // Check if allowed here - this cannot be automatically checked beforehand.
          !shouldIgnore(node.callee.object, context, options) &&
          arrayMutatorMethods.some(isMethodName) &&
          (!options.ignoreImmediateMutation ||
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
          ? [{ node, messageId: "array" }]
          : // Potential non-array object mutation (ex. Object.assign on identifier)?
          objectConstructorMutatorFunctions.some(isMethodName) &&
            node.arguments.length >= 2 &&
            (isIdentifier(node.arguments[0]) ||
              isMemberExpression(node.arguments[0])) &&
            // Check if allowed here - this cannot be automatically checked beforehand.
            !shouldIgnore(node.arguments[0], context, options) &&
            isObjectConstructorType(
              getTypeOfNode(node.callee.object, context),
              assumeTypesForObjects,
              node.callee.object
            )
          ? [{ node, messageId: "object" }]
          : []
        : [],
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
