import { TSESTree } from "@typescript-eslint/typescript-estree";

import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-class" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected class, use functions not classes."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow classes.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given class node violates this rule.
 */
function checkClass(
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  // All class nodes violate this rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkClass = checkNode(checkClass, context, undefined, options);

    return {
      ClassDeclaration: _checkClass,
      ClassExpression: _checkClass
    };
  }
});
