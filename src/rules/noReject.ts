import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isIdentifier, isMemberExpression } from "../util/typeguard";

// The name of this rule.
export const name = "no-reject" as const;

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
  node: TSESTree.CallExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  if (
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.object) &&
    isIdentifier(node.callee.property) &&
    node.callee.object.name === "Promise" &&
    node.callee.property.name === "reject"
  ) {
    context.report({ node, messageId: "generic" });
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkCallExpression = checkNode(
      checkCallExpression,
      context,
      undefined,
      options
    );

    return {
      CallExpression: _checkCallExpression
    };
  }
});
