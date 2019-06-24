import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "readonly-keyword" as const;

// The options this rule can take.
type Options = [];
// TODO: add options:
// Ignore.IgnoreLocalOption &
// Ignore.IgnoreOption &
// Ignore.IgnoreClassOption &
// Ignore.IgnoreInterfaceOption;

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "A readonly modifier is required."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce readonly modifiers are used where possible.",
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
  return (node: TSESTree.TSPropertySignature | TSESTree.TSIndexSignature) => {
    if (!node.readonly) {
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
    const _checkNode = checkNode(context);

    return {
      TSPropertySignature: _checkNode,
      TSIndexSignature: _checkNode,
      TSPropertyDeclaration: _checkNode
    };
  }
});
