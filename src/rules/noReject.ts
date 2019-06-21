import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isIdentifier, isMemberExpression } from "../util/typeguard";

// The name of this rule.
export const name = "no-try" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected reject, return an error instead."
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
 * Check if the given CallExpression violates this rule.
 */
function checkCallExpression(
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.CallExpression) => {
    if (
      isMemberExpression(node.callee) &&
      isIdentifier(node.callee.object) &&
      isIdentifier(node.callee.property) &&
      node.callee.object.name === "Promise" &&
      node.callee.property.name === "reject"
    ) {
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
    const _checkCallExpression = checkCallExpression(context);

    return {
      CallExpression: _checkCallExpression
    };
  }
});
