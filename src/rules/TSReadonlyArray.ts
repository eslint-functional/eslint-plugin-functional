import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData, checkNode } from "../util/rule";

// The name of this rule.
export const name = "readonly-array" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Only ReadonlyArray allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly array over mutable arrays.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given node violates this rule.
 */
function check(
  node: TSESTree.ArrayPattern | TSESTree.ArrayExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  // TODO: port rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkNode = checkNode(check, context, options);

    return {
      ArrayPattern: _checkNode,
      ArrayExpression: _checkNode
    };
  }
});
