import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type ESLoop } from "#eslint-plugin-functional/utils/node-types";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
  createRule,
} from "#eslint-plugin-functional/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-loop-statements" as const;

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
  generic: "Unexpected loop, use map or reduce instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Statements",
    description: "Disallow imperative loops.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given loop violates this rule.
 */
function checkLoop(
  node: ESLoop,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options> {
  // All loops violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ForStatement: checkLoop,
    ForInStatement: checkLoop,
    ForOfStatement: checkLoop,
    WhileStatement: checkLoop,
    DoWhileStatement: checkLoop,
  },
);
