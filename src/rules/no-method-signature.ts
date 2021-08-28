import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { RuleResult } from "~/util/rule";
import { createRule } from "~/util/rule";
import { inReadonly } from "~/util/tree";

/**
 * The name of this rule.
 */
export const name = "no-method-signature" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  Readonly<{
    ignoreIfReadonly: boolean;
  }>
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      ignoreIfReadonly: {
        type: "boolean",
        default: true,
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
    ignoreIfReadonly: true,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic:
    "Method signature is mutable, use property signature with readonly modifier instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  deprecated: true,
  replacedBy: ["prefer-readonly-type-declaration"],
  type: "suggestion",
  docs: {
    description: "Prefer property signatures over method signatures.",
    recommended: "warn",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TSMethodSignature violates this rule.
 */
function checkTSMethodSignature(
  node: ReadonlyDeep<TSESTree.TSMethodSignature>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ ignoreIfReadonly }] = options;

  if (ignoreIfReadonly && inReadonly(node)) {
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
