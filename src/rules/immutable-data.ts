import { type TSESTree } from "@typescript-eslint/utils";
import {
  type JSONSchema4,
  type JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  ignoreAccessorPatternOptionSchema,
  ignoreClassesOptionSchema,
  ignoreIdentifierPatternOptionSchema,
  shouldIgnoreClasses,
  shouldIgnorePattern,
  type IgnoreAccessorPatternOption,
  type IgnoreClassesOption,
  type IgnoreIdentifierPatternOption,
} from "#eslint-plugin-functional/options";
import {
  isExpected,
  ruleNameScope,
} from "#eslint-plugin-functional/utils/misc";
import {
  createRule,
  getTypeOfNode,
  type NamedCreateRuleCustomMeta,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";
import {
  findRootIdentifier,
  isDefinedByMutableVariable,
  isInConstructor,
} from "#eslint-plugin-functional/utils/tree";
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
} from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "immutable-data" as const;

/**
 * The full name of this rule.
 */
export const fullName = `${ruleNameScope}/${name}` as const;

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreAccessorPatternOption &
    IgnoreClassesOption &
    IgnoreIdentifierPatternOption & {
      ignoreImmediateMutation: boolean;
      ignoreNonConstDeclarations:
        | boolean
        | {
            treatParametersAsConst: boolean;
          };
    },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(
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
      } satisfies JSONSchema4ObjectSchema["properties"],
    ),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreClasses: false,
    ignoreImmediateMutation: true,
    ignoreNonConstDeclarations: false,
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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, Options> = {
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    ignoreIdentifierPattern,
    ignoreAccessorPattern,
    ignoreNonConstDeclarations,
    ignoreClasses,
  } = optionsObject;

  if (
    !isMemberExpression(node.left) ||
    shouldIgnoreClasses(node, context, ignoreClasses) ||
    shouldIgnorePattern(
      node,
      context,
      ignoreIdentifierPattern,
      ignoreAccessorPattern,
    )
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
          shouldIgnorePattern(
            variableNode,
            context,
            ignoreIdentifierPattern,
            ignoreAccessorPattern,
          ),
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    ignoreIdentifierPattern,
    ignoreAccessorPattern,
    ignoreNonConstDeclarations,
    ignoreClasses,
  } = optionsObject;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClasses(node, context, ignoreClasses) ||
    shouldIgnorePattern(
      node,
      context,
      ignoreIdentifierPattern,
      ignoreAccessorPattern,
    )
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
          shouldIgnorePattern(
            variableNode,
            context,
            ignoreIdentifierPattern,
            ignoreAccessorPattern,
          ),
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
      node.operator === "delete" ? [{ node, messageId: "generic" }] : [],
  };
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: TSESTree.UpdateExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    ignoreIdentifierPattern,
    ignoreAccessorPattern,
    ignoreNonConstDeclarations,
    ignoreClasses,
  } = optionsObject;

  if (
    !isMemberExpression(node.argument) ||
    shouldIgnoreClasses(node.argument, context, ignoreClasses) ||
    shouldIgnorePattern(
      node.argument,
      context,
      ignoreIdentifierPattern,
      ignoreAccessorPattern,
    )
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
          shouldIgnorePattern(
            variableNode,
            context,
            ignoreIdentifierPattern,
            ignoreAccessorPattern,
          ),
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
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
  if (
    isNewExpression(node) &&
    isArrayConstructorType(getTypeOfNode(node.callee, context))
  ) {
    return true;
  }

  if (
    isCallExpression(node) &&
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.property)
  ) {
    // Check for: Array.from(iterable)
    if (
      arrayConstructorFunctions.some(isExpected(node.callee.property.name)) &&
      isArrayConstructorType(getTypeOfNode(node.callee.object, context))
    ) {
      return true;
    }

    // Check for: array.slice(0)
    if (
      arrayNewObjectReturningMethods.some(isExpected(node.callee.property.name))
    ) {
      return true;
    }

    // Check for: Object.entries(object)
    if (
      objectConstructorNewObjectReturningMethods.some(
        isExpected(node.callee.property.name),
      ) &&
      isObjectConstructorType(getTypeOfNode(node.callee.object, context))
    ) {
      return true;
    }

    // Check for: "".split("")
    if (
      stringConstructorNewObjectReturningMethods.some(
        isExpected(node.callee.property.name),
      ) &&
      getTypeOfNode(node.callee.object, context).isStringLiteral()
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Check if the given node violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    ignoreIdentifierPattern,
    ignoreAccessorPattern,
    ignoreNonConstDeclarations,
    ignoreClasses,
  } = optionsObject;

  // Not potential object mutation?
  if (
    !isMemberExpression(node.callee) ||
    !isIdentifier(node.callee.property) ||
    shouldIgnoreClasses(node.callee.object, context, ignoreClasses) ||
    shouldIgnorePattern(
      node.callee.object,
      context,
      ignoreIdentifierPattern,
      ignoreAccessorPattern,
    )
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreImmediateMutation } = optionsObject;

  // Array mutation?
  if (
    arrayMutatorMethods.has(node.callee.property.name) &&
    (!ignoreImmediateMutation ||
      !isInChainCallAndFollowsNew(node.callee, context)) &&
    isArrayType(getTypeOfNode(node.callee.object, context))
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
          shouldIgnorePattern(
            variableNode,
            context,
            ignoreIdentifierPattern,
            ignoreAccessorPattern,
          ),
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
    (isIdentifier(node.arguments[0]!) ||
      isMemberExpression(node.arguments[0]!)) &&
    !shouldIgnoreClasses(node.arguments[0], context, ignoreClasses) &&
    !shouldIgnorePattern(
      node.arguments[0],
      context,
      ignoreIdentifierPattern,
      ignoreAccessorPattern,
    ) &&
    isObjectConstructorType(getTypeOfNode(node.callee.object, context))
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
          shouldIgnorePattern(
            variableNode,
            context,
            ignoreIdentifierPattern,
            ignoreAccessorPattern,
          ),
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
export const rule = createRule<keyof typeof errorMessages, Options>(
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
