import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";
import { getEnclosingFunction, getEnclosingTryStatement } from "#/utils/tree";
import { isFunctionLike, isIdentifier, isMemberExpression } from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-promise-reject";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [{}];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [{}];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Unexpected rejection, resolve an error instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Exceptions",
    description: "Disallow rejecting promises.",
    recommended: false,
    recommendedSeverity: "error",
    requiresTypeChecking: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given CallExpression violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      // TODO: Better Promise type detection.
      isMemberExpression(node.callee) &&
      isIdentifier(node.callee.object) &&
      isIdentifier(node.callee.property) &&
      node.callee.object.name === "Promise" &&
      node.callee.property.name === "reject"
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given NewExpression is for a Promise and it has a callback that rejects.
 */
function checkNewExpression(
  node: TSESTree.NewExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      // TODO: Better Promise type detection.
      isIdentifier(node.callee) &&
      node.callee.name === "Promise" &&
      node.arguments[0] !== undefined &&
      isFunctionLike(node.arguments[0]) &&
      node.arguments[0].params.length === 2
        ? [{ node: node.arguments[0].params[1]!, messageId: "generic" }]
        : [],
  };
}

/**
 * Check if the given ThrowStatement violates this rule.
 */
function checkThrowStatement(
  node: TSESTree.ThrowStatement,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  const enclosingFunction = getEnclosingFunction(node);
  if (enclosingFunction?.async !== true) {
    return { context, descriptors: [] };
  }

  const enclosingTryStatement = getEnclosingTryStatement(node);
  if (
    enclosingTryStatement === null ||
    getEnclosingFunction(enclosingTryStatement) !== enclosingFunction ||
    enclosingTryStatement.handler === null
  ) {
    return {
      context,
      descriptors: [{ node, messageId: "generic" }],
    };
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    CallExpression: checkCallExpression,
    NewExpression: checkNewExpression,
    ThrowStatement: checkThrowStatement,
  },
);
