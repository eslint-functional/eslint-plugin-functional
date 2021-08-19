import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";

import type {
  AllowLocalMutationOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  shouldIgnorePattern,
  shouldIgnoreLocalMutation,
  allowLocalMutationOptionSchema,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule } from "~/util/rule";

// The name of this rule.
export const name = "no-let" as const;

// The options this rule can take.
type Options = AllowLocalMutationOption & IgnorePatternOption;

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([allowLocalMutationOptionSchema, ignorePatternOptionSchema]),
];

// The default options for the rule.
const defaultOptions: Options = {
  allowLocalMutation: false,
};

// The possible error messages.
const errorMessages = {
  generic: "Unexpected let, use const instead.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutable variables.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

/**
 * Check if the given VariableDeclaration violates this rule.
 */
function checkVariableDeclaration(
  node: TSESTree.VariableDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    shouldIgnoreLocalMutation(node, context, options) ||
    shouldIgnorePattern(node, context, options)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: node.kind === "let" ? [{ node, messageId: "generic" }] : [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    VariableDeclaration: checkVariableDeclaration,
  }
);
