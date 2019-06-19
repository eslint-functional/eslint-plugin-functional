import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import { isAssignmentKind } from "tsutils/util";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeTypedRule
} from "./shared/check-node";
import * as Ignore from "./shared/ignore";
import { isAccessExpression, AccessExpression } from "./shared/typeguard";

type Options = Ignore.IgnoreNewArrayOption &
  Ignore.IgnoreMutationFollowingAccessorOption &
  Ignore.IgnoreOption;

type ArrayType = ts.Type & {
  symbol: {
    name: "Array";
  };
};

type ArrayConstructorType = ts.Type & {
  symbol: {
    name: "ArrayConstructor";
  };
};

export const Rule = createCheckNodeTypedRule(
  checkTypedNode,
  "Mutating an array is not allowed."
);

export function isArrayType(type: ts.Type): type is ArrayType {
  return Boolean(type.symbol && type.symbol.name === "Array");
}

export function isArrayConstructorType(
  type: ts.Type
): type is ArrayConstructorType {
  return Boolean(type.symbol && type.symbol.name === "ArrayConstructor");
}

const forbidUnaryOps: ReadonlyArray<ts.SyntaxKind> = [
  ts.SyntaxKind.PlusPlusToken,
  ts.SyntaxKind.MinusMinusToken
];

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

function checkTypedNode(
  node: ts.Node,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (utils.isBinaryExpression(node)) {
    return checkBinaryExpression(node, ctx, checker);
  }

  if (utils.isDeleteExpression(node)) {
    return checkDeleteExpression(node, ctx, checker);
  }

  if (utils.isPrefixUnaryExpression(node)) {
    return checkPrefixUnaryExpression(node, ctx, checker);
  }

  if (utils.isPostfixUnaryExpression(node)) {
    return checkPostfixUnaryExpression(node, ctx, checker);
  }

  if (utils.isCallExpression(node)) {
    return checkCallExpression(node, ctx, checker);
  }

  return { invalidNodes: [] };
}

/**
 * No assignment with array[index] on the left.
 * No assignment with array.property on the left (e.g. array.length).
 */
function checkBinaryExpression(
  node: ts.BinaryExpression,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (
    !Ignore.isIgnored(
      node.left,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    ) &&
    isAssignmentKind(node.operatorToken.kind) &&
    isAccessExpression(node.left)
  ) {
    const leftExpressionType = checker.getTypeAtLocation(
      getRootAccessExpression(node.left).expression
    );

    if (isArrayType(leftExpressionType)) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}

/**
 * No deleting array properties/values.
 */
function checkDeleteExpression(
  node: ts.DeleteExpression,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (
    !Ignore.isIgnored(
      node.expression,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    ) &&
    isAccessExpression(node.expression)
  ) {
    const expressionType = checker.getTypeAtLocation(
      getRootAccessExpression(node.expression).expression
    );

    if (isArrayType(expressionType)) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}

/**
 * No prefix inc/dec.
 */
function checkPrefixUnaryExpression(
  node: ts.PrefixUnaryExpression,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (
    !Ignore.isIgnored(
      node.operand,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    ) &&
    isAccessExpression(node.operand) &&
    forbidUnaryOps.some(o => o === node.operator)
  ) {
    const operandExpressionType = checker.getTypeAtLocation(
      getRootAccessExpression(node.operand).expression
    );

    if (isArrayType(operandExpressionType)) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}

/**
 * No postfix inc/dec.
 */
function checkPostfixUnaryExpression(
  node: ts.PostfixUnaryExpression,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (
    !Ignore.isIgnored(
      node.operand,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    ) &&
    isAccessExpression(node.operand) &&
    forbidUnaryOps.some(o => o === node.operator)
  ) {
    const operandExpressionType = checker.getTypeAtLocation(
      getRootAccessExpression(node.operand).expression
    );

    if (isArrayType(operandExpressionType)) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}

/**
 * No calls to array mutating methods.
 */
function checkCallExpression(
  node: ts.CallExpression,
  ctx: Lint.WalkContext<Options>,
  checker: ts.TypeChecker
): CheckNodeResult {
  if (
    !Ignore.isIgnored(
      node.expression,
      ctx.options.ignorePattern,
      ctx.options.ignorePrefix,
      ctx.options.ignoreSuffix
    ) &&
    utils.isPropertyAccessExpression(node.expression) &&
    (!(
      ctx.options.ignoreNewArray || ctx.options.ignoreMutationFollowingAccessor
    ) ||
      !isInChainCallAndFollowsNew(node.expression, checker)) &&
    mutatorMethods.some(
      m => m === (node.expression as ts.PropertyAccessExpression).name.text
    )
  ) {
    // Do the type checking as late as possible (as it is expensive).
    const expressionType = checker.getTypeAtLocation(
      getRootAccessExpression(node.expression).expression
    );

    if (isArrayType(expressionType)) {
      return { invalidNodes: [createInvalidNode(node, [])] };
    }
  }
  return { invalidNodes: [] };
}

/**
 * Check if the given the given PropertyAccessExpression is part of a chain and
 * immediately follows a method/function call that returns a new array.
 *
 * If this is the case, then the given PropertyAccessExpression is allowed to be a mutator method call.
 */
function isInChainCallAndFollowsNew(
  node: ts.PropertyAccessExpression,
  checker: ts.TypeChecker
): boolean {
  return (
    utils.isArrayLiteralExpression(node.expression) ||
    (utils.isNewExpression(node.expression) &&
      isArrayConstructorType(
        checker.getTypeAtLocation(node.expression.expression)
      )) ||
    (utils.isCallExpression(node.expression) &&
      utils.isPropertyAccessExpression(node.expression.expression) &&
      constructorFunctions.some(
        isExpected(node.expression.expression.name.text)
      ) &&
      isArrayConstructorType(
        checker.getTypeAtLocation(node.expression.expression.expression)
      )) ||
    (utils.isCallExpression(node.expression) &&
      utils.isPropertyAccessExpression(node.expression.expression) &&
      newArrayReturningMethods.some(
        isExpected(node.expression.expression.name.text)
      ))
  );
}

/**
 * Returns a function that checks if the given value is the same as the expected value.
 */
function isExpected<T>(expected: T): (actual: T) => boolean {
  return actual => actual === expected;
}

function getRootAccessExpression(n: AccessExpression): AccessExpression {
  if (isAccessExpression(n.expression)) {
    return getRootAccessExpression(n.expression);
  }
  return n;
}
