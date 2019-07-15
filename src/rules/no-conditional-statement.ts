import { TSESTree } from "@typescript-eslint/typescript-estree";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";

// The name of this rule.
export const name = "no-conditional-statement" as const;

// The options this rule can take.
type Options = readonly [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  if: "Unexpected if, use a conditional expression (ternary operator) instead.",
  switch:
    "Unexpected switch, use a conditional expression (ternary operator) instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow if statements.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given IfStatement violates this rule.
 */
function checkIfStatement(
  node: TSESTree.IfStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // All if statements violate this rule.
  return { context, descriptors: [{ node, messageId: "if" }] };
}

/**
 * Check if the given SwitchStatement violates this rule.
 */
function checkSwitchStatement(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // All if statements violate this rule.
  return { context, descriptors: [{ node, messageId: "switch" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkIfStatement = checkNode(checkIfStatement, context);
    const _checkSwitchStatement = checkNode(checkSwitchStatement, context);

    return {
      IfStatement: _checkIfStatement,
      SwitchStatement: _checkSwitchStatement
    };
  }
});
