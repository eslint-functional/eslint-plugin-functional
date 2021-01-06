import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/utils/rule";
import { createRule } from "~/utils/rule";

// The name of this rule.
export const name = "no-try-statement" as const;

// The options this rule can take.
type Options = {
  readonly allowCatch: boolean;
  readonly allowFinally: boolean;
};

// The schema for the rule options.
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

// The default options for the rule.
const defaultOptions: Options = {
  allowCatch: false,
  allowFinally: false,
};

// The possible error messages.
const errorMessages = {
  catch: "Unexpected try-catch, this pattern is not functional.",
  finally: "Unexpected try-finally, this pattern is not functional.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow try-catch[-finally] and try-finally patterns.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given TryStatement violates this rule.
 */
function checkTryStatement(
  node: TSESTree.TryStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      !options.allowCatch && node.handler !== null
        ? [{ node, messageId: "catch" }]
        : !options.allowFinally && node.finalizer !== null
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
