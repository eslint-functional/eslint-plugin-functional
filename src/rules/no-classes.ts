import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";
import { type ESClass } from "#eslint-plugin-functional/utils/node-types";
import {
  createRule,
  type NamedCreateRuleCustomMeta,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-classes" as const;

/**
 * The full name of this rule.
 */
export const fullName = `${ruleNameScope}/${name}` as const;

/**
 * The options this rule can take.
 */
type Options = [{}];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [{}];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Unexpected class, use functions not classes.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, Options> = {
  type: "suggestion",
  docs: {
    category: "No Other Paradigms",
    description: "Disallow classes.",
    recommended: "recommended",
    recommendedSeverity: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given class node violates this rule.
 */
function checkClass(
  node: ESClass,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  // All class nodes violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  { ClassDeclaration: checkClass, ClassExpression: checkClass },
);
