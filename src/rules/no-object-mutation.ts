import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-object-mutation" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Modifying properties of existing object not allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutating objects.",
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
  node: TSESTree.Node,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  // TODO: port rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkNode = checkNode(check, context, undefined, options);

    return {
      ExpressionStatement: _checkNode
    };
  }
});
