import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-throw" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected throw, throwing exceptions is not functional."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow throwing exceptions.",
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
  node: TSESTree.ThrowStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  // All throw statements violate this rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkThrowStatement = checkNode(
      checkThrowStatement,
      context,
      undefined,
      options
    );

    return {
      ThrowStatement: _checkThrowStatement
    };
  }
});
