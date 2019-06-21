import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-expression-statement" as const;

// The options this rule can take.
type Options = []; // TODO: add IgnoreOption

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Using expressions to cause side-effects not allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow expression statements.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given ExpressionStatement violates this rule.
 */
function checkExpressionStatement(
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.ExpressionStatement) => {
    // All expression statements violate this rule.
    context.report({ node, messageId: "generic" });
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkExpressionStatement = checkExpressionStatement(context);

    return {
      ExpressionStatement: _checkExpressionStatement
    };
  }
});
