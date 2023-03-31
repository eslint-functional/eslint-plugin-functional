import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleResult, NamedCreateRuleMetaWithCategory } from "~/utils/rule";
import { createRule } from "~/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-try-statements" as const;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowCatch: boolean;
    allowFinally: boolean;
  }
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowCatch: {
        type: "boolean",
      },
      allowFinally: {
        type: "boolean",
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
    allowCatch: false,
    allowFinally: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  catch: "Unexpected try-catch, this pattern is not functional.",
  finally: "Unexpected try-finally, this pattern is not functional.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Exceptions",
    description: "Disallow try-catch[-finally] and try-finally patterns.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TryStatement violates this rule.
 */
function checkTryStatement(
  node: TSESTree.TryStatement,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ allowCatch, allowFinally }] = options;

  return {
    context,
    descriptors:
      !allowCatch && node.handler !== null
        ? [{ node, messageId: "catch" }]
        : !allowFinally && node.finalizer !== null
        ? [{ node, messageId: "finally" }]
        : [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TryStatement: checkTryStatement,
  }
);
