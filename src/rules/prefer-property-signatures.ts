import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleResult, NamedCreateRuleMetaWithCategory } from "~/utils/rule";
import { createRule } from "~/utils/rule";
import { inReadonly } from "~/utils/tree";

/**
 * The name of this rule.
 */
export const name = "prefer-property-signatures" as const;

/**
 * The options this rule can take.
 */
type Options = [
  {
    ignoreIfReadonlyWrapped: boolean;
  }
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      ignoreIfReadonlyWrapped: {
        type: "boolean",
        default: false,
      },
    },
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreIfReadonlyWrapped: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Use a property signature instead of a method signature",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description: "Prefer property signatures over method signatures.",
    recommended: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TSMethodSignature violates this rule.
 */
function checkTSMethodSignature(
  node: TSESTree.TSMethodSignature,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ ignoreIfReadonlyWrapped }] = options;

  if (ignoreIfReadonlyWrapped && inReadonly(node)) {
    return { context, descriptors: [] };
  }

  // All TS method signatures violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSMethodSignature: checkTSMethodSignature,
  }
);
