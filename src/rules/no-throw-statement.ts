import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import { inFunctionBody } from "~/src/util/tree";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule } from "~/util/rule";

// The name of this rule.
export const name = "no-throw-statement" as const;

// The options this rule can take.
type Options = {
  readonly allowInAsyncFunctions: boolean;
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowInAsyncFunctions: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
];

// The default options for the rule.
const defaultOptions: Options = {
  allowInAsyncFunctions: false,
};

// The possible error messages.
const errorMessages = {
  generic: "Unexpected throw, throwing exceptions is not functional.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow throwing exceptions.",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given ThrowStatement violates this rule.
 */
function checkThrowStatement(
  node: TSESTree.ThrowStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (!options.allowInAsyncFunctions || !inFunctionBody(node, true)) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ThrowStatement: checkThrowStatement,
  }
);
