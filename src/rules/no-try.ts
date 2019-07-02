import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-try" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic:
    "Unexpected try, the try-catch[-finally] and try-finally patterns are not functional."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow try-catch[-finally] and try-finally patterns.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given TryStatement violates this rule.
 */
function checkTryStatement(
  node: TSESTree.TryStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  // All try statements violate this rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkTryStatement = checkNode(
      checkTryStatement,
      context,
      undefined,
      options
    );

    return {
      TryStatement: _checkTryStatement
    };
  }
});
