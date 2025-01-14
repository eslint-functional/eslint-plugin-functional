import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-this-expressions";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type RawOptions = [{}];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [];

/**
 * The default options for the rule.
 */
const defaultOptions: RawOptions = [{}];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Unexpected this, use functions not classes.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, RawOptions> = {
  type: "suggestion",
  docs: {
    category: "No Other Paradigms",
    description: "Disallow this access.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given ThisExpression violates this rule.
 */
function checkThisExpression(
  node: TSESTree.ThisExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  // All throw statements violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, RawOptions> = createRule<keyof typeof errorMessages, RawOptions>(
  name,
  meta,
  defaultOptions,
  {
    ThisExpression: checkThisExpression,
  },
);
