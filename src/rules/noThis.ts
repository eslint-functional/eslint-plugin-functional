import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-throw" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected this, use functions not classes."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow this access.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given ThrowStatement violates this rule.
 */
function checkThrowStatement(
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.ThrowStatement) => {
    // All throw statements violate this rule.
    context.report({ node, messageId: "generic" });
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkThrowStatement = checkThrowStatement(context);

    return {
      ThrowStatement: _checkThrowStatement
    };
  }
});
