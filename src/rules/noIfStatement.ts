import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-if-statement" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic:
    "Unexpected if, use a conditional expression (ternary operator) instead."
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
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  return (node: TSESTree.IfStatement) => {
    // All if statements violate this rule.
    context.report({ node, messageId: "generic" });
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkIfStatement = checkIfStatement(context);

    return {
      IfStatement: _checkIfStatement
    };
  }
});
