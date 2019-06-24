import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

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
 * Check if the given TSPropertySignature violates this rule.
 */
function checkNode(context: RuleContext<Options, keyof typeof errorMessages>) {
  return (node: TSESTree.ArrayPattern | TSESTree.ArrayExpression) => {
    // TODO: port rule.
    context.report({ node, messageId: "generic" });
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkNode = checkNode(context);

    return {
      ArrayPattern: _checkNode,
      ArrayExpression: _checkNode
    };
  }
});
