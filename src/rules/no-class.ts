import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/utils/rule";
import { createRule } from "~/utils/rule";

// The name of this rule.
export const name = "no-class" as const;

// The options this rule can take.
type Options = {};

// The schema for the rule options.
const schema: JSONSchema4 = [];

// The default options for the rule.
const defaultOptions: Options = {};

// The possible error messages.
const errorMessages = {
  generic: "Unexpected class, use functions not classes.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow classes.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given class node violates this rule.
 */
function checkClass(
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // All class nodes violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  { ClassDeclaration: checkClass, ClassExpression: checkClass }
);
