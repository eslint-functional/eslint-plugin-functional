import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  getParserServices,
  ParserServices,
  RuleContext,
  RuleMetaData
} from "../util/rule";
import {
  isArrayConstructorType,
  isArrayExpression,
  isArrayType,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isNewExpression
} from "../util/typeguard";

// The name of this rule.
export const name = "no-array-mutation" as const;

// The options this rule can take.
type Options = [ignore.IgnorePatternOptions & ignore.IgnoreNewArrayOption];

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignorePatternOptionsSchema,
    ignore.ignoreNewArrayOptionSchema
  ])
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreNewArray: true
  }
];

// The possible error messages.
const errorMessages = {
  generic: "Mutating an array is not allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutating arrays.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema
};

/**
 * Methods that mutate an array.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods#Mutator_methods
 */
const mutatorMethods: ReadonlyArray<string> = [
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
];

/**
 * Methods that return a new array without mutating the original.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods#Accessor_methods
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Iteration_methods
 */
const newArrayReturningMethods: ReadonlyArray<string> = [
  "concat",
  "slice",
  "filter",
  "map",
  "reduce",
  "reduceRight"
];

/**
 * Functions that create a new array.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods
 */
const constructorFunctions = ["from", "of"];

/**
 * Check if the given node violates this rule.
 */
function checkAssignmentExpression(
  node: TSESTree.AssignmentExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  if (isMemberExpression(node.left)) {
    const parserServices = getParserServices(context);

    if (
      isArrayType(
        parserServices.program
          .getTypeChecker()
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.left.object)
          )
      )
    ) {
      context.report({ node, messageId: "generic" });
    }
  }
}

/**
 * Check if the given node violates this rule.
 */
function checkUnaryExpression(
  node: TSESTree.UnaryExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  if (node.operator === "delete" && isMemberExpression(node.argument)) {
    const parserServices = getParserServices(context);
    const type = parserServices.program
      .getTypeChecker()
      .getTypeAtLocation(
        parserServices.esTreeNodeToTSNodeMap.get(node.argument.object)
      );

    if (isArrayType(type)) {
      context.report({ node, messageId: "generic" });
    }
  }
}

/**
 * Check if the given node violates this rule.
 */
function checkUpdateExpression(
  node: TSESTree.UpdateExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  if (
    (node.operator === "++" || node.operator === "--") &&
    isMemberExpression(node.argument)
  ) {
    const parserServices = getParserServices(context);

    if (
      isArrayType(
        parserServices.program
          .getTypeChecker()
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.argument.object)
          )
      )
    ) {
      context.report({ node, messageId: "generic" });
    }
  }
}

/**
 * Check if the given node violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
) {
  if (
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.property) &&
    mutatorMethods.some(
      m =>
        m ===
        ((node.callee as TSESTree.MemberExpression)
          .property as TSESTree.Identifier).name
    )
  ) {
    const parserServices = getParserServices(context);

    if (
      options.ignoreNewArray &&
      isInChainCallAndFollowsNew(node.callee, parserServices)
    ) {
      return;
    }

    if (
      isArrayType(
        parserServices.program
          .getTypeChecker()
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.callee.object)
          )
      )
    ) {
      context.report({ node, messageId: "generic" });
    }
  }
}

/**
 * Returns a function that checks if the given value is the same as the expected value.
 */
function isExpected<T>(expected: T): (actual: T) => boolean {
  return actual => actual === expected;
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
  parserServices: ParserServices
): boolean {
  return (
    // Check for: [0, 1, 2]
    isArrayExpression(node.object) ||
    // Check for: new Array()
    ((isNewExpression(node.object) &&
      isArrayConstructorType(
        parserServices.program
          .getTypeChecker()
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.object.callee)
          )
      )) ||
      (isCallExpression(node.object) &&
        isMemberExpression(node.object.callee) &&
        isIdentifier(node.object.callee.property) &&
        // Check for: Object.from(iterable)
        ((constructorFunctions.some(
          isExpected(node.object.callee.property.name)
        ) &&
          isArrayConstructorType(
            parserServices.program
              .getTypeChecker()
              .getTypeAtLocation(
                parserServices.esTreeNodeToTSNodeMap.get(
                  node.object.callee.object
                )
              )
          )) ||
          // Check for: array.slice(0)
          newArrayReturningMethods.some(
            isExpected(node.object.callee.property.name)
          ))))
  );
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkAssignmentExpression = checkNode(
      checkAssignmentExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkUnaryExpression = checkNode(
      checkUnaryExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkUpdateExpression = checkNode(
      checkUpdateExpression,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkCallExpression = checkNode(
      checkCallExpression,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      AssignmentExpression: _checkAssignmentExpression,
      UnaryExpression: _checkUnaryExpression,
      UpdateExpression: _checkUpdateExpression,
      CallExpression: _checkCallExpression
    };
  }
});
