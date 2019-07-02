import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-loop-statement" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected loop, use map or reduce instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow imperative loops.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given loop violates this rule.
 */
function checkLoop(
  node:
    | TSESTree.ForStatement
    | TSESTree.ForInStatement
    | TSESTree.ForOfStatement
    | TSESTree.WhileStatement
    | TSESTree.DoWhileStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  // All loops violate this rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkLoop = checkNode(checkLoop, context, undefined, options);

    return {
      ForStatement: _checkLoop,
      ForInStatement: _checkLoop,
      ForOfStatement: _checkLoop,
      WhileStatement: _checkLoop,
      DoWhileStatement: _checkLoop
    };
  }
});
