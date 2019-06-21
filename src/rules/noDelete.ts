import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-delete" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected delete, objects should be considered immutable."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow delete expressions.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given UnaryExpression violates this rule.
 */
function checkUnaryExpression(
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.UnaryExpression) => {
    if (node.operator === "delete") {
      context.report({ node, messageId: "generic" });
    }
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkUnaryExpression = checkUnaryExpression(context);

    return {
      UnaryExpression: _checkUnaryExpression
    };
  }
});
