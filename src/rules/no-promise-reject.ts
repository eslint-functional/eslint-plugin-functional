import { type TSESTree } from "@typescript-eslint/utils";
import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";
import {
  createRule,
  type NamedCreateRuleCustomMeta,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";
import {
  isIdentifier,
  isMemberExpression,
} from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-promise-reject" as const;

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
  generic: "Unexpected reject, return an error instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, Options> = {
  type: "suggestion",
  docs: {
    category: "No Exceptions",
    description: "Disallow rejecting promises.",
    recommended: false,
    recommendedSeverity: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given CallExpression violates this rule.
 */
function checkCallExpression(
  node: TSESTree.CallExpression,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      isMemberExpression(node.callee) &&
      isIdentifier(node.callee.object) &&
      isIdentifier(node.callee.property) &&
      node.callee.object.name === "Promise" &&
      node.callee.property.name === "reject"
        ? [{ node, messageId: "generic" }]
        : [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    CallExpression: checkCallExpression,
  },
);
