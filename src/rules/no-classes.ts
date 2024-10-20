import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  type IgnoreCodePatternOption,
  type IgnoreIdentifierPatternOption,
  ignoreCodePatternOptionSchema,
  ignoreIdentifierPatternOptionSchema,
  shouldIgnorePattern,
} from "#/options";
import { ruleNameScope } from "#/utils/misc";
import type { ESClass } from "#/utils/node-types";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-classes";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [IgnoreIdentifierPatternOption & IgnoreCodePatternOption];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(ignoreIdentifierPatternOptionSchema, ignoreCodePatternOptionSchema),
    additionalProperties: false,
  },
];

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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Other Paradigms",
    description: "Disallow classes.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: false,
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
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreIdentifierPattern, ignoreCodePattern } = optionsObject;

  if (shouldIgnorePattern(node, context, ignoreIdentifierPattern, undefined, ignoreCodePattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ClassDeclaration: checkClass,
    ClassExpression: checkClass,
  },
);
