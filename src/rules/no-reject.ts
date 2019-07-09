import { TSESTree } from "@typescript-eslint/typescript-estree";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isIdentifier, isMemberExpression } from "../util/typeguard";

// The name of this rule.
export const name = "no-reject" as const;

// The options this rule can take.
type Options = readonly [];

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
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.object) &&
    isIdentifier(node.callee.property) &&
    node.callee.object.name === "Promise" &&
    node.callee.property.name === "reject"
  ) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  return { context, descriptors: [] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkCallExpression = checkNode(checkCallExpression, context);

    return {
      CallExpression: _checkCallExpression
    };
  }
});
