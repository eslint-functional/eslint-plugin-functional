import { TSESTree } from "@typescript-eslint/typescript-estree";

import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-method-signature" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic:
    "Method signature is mutable, use property signature with readonly modifier instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Prefer property signatures with readonly modifiers over method signatures.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given TSMethodSignature violates this rule.
 */
function checkTSMethodSignature(
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  return (node: TSESTree.TSMethodSignature) => {
    // All TS method signatures violate this rule.
    context.report({ node, messageId: "generic" });
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkTSMethodSignature = checkTSMethodSignature(context);

    return {
      TSMethodSignature: _checkTSMethodSignature
    };
  }
});
