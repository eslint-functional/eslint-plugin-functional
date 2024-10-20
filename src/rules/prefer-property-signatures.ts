import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";
import { isInReadonly } from "#/utils/tree";

/**
 * The name of this rule.
 */
export const name = "prefer-property-signatures";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [
  {
    ignoreIfReadonlyWrapped: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description: "Prefer property signatures over method signatures.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TSMethodSignature violates this rule.
 */
function checkTSMethodSignature(
  node: TSESTree.TSMethodSignature,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ ignoreIfReadonlyWrapped }] = options;

  if (ignoreIfReadonlyWrapped && isInReadonly(node)) {
    return { context, descriptors: [] };
  }

  // All TS method signatures violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSMethodSignature: checkTSMethodSignature,
  },
);
