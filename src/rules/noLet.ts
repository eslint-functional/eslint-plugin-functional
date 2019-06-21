import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-let" as const;

// The options this rule can take.
type Options = []; // TODO: add IgnoreLocalOption & Ignore.IgnoreOption

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected let, use const instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutable variables.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given VariableDeclaration violates this rule.
 */
function checkVariableDeclaration(
  context: RuleContext<Options, keyof typeof errorMessages>
) {
  return (node: TSESTree.VariableDeclaration) => {
    if (node.kind === "let") {
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
    const _checkVariableDeclaration = checkVariableDeclaration(context);

    return {
      VariableDeclaration: _checkVariableDeclaration
    };
  }
});
