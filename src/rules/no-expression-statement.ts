import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";

import type { IgnorePatternOption } from "~/common/ignore-options";
import {
  shouldIgnorePattern,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import { isDirectivePrologue } from "~/util/misc";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule, getTypeOfNode } from "~/util/rule";
import { isVoidType } from "~/util/typeguard";

// The name of this rule.
export const name = "no-expression-statement" as const;

// The options this rule can take.
type Options = IgnorePatternOption & {
  readonly ignoreVoid: boolean;
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignorePatternOptionSchema,
    {
      type: "object",
      properties: {
        ignoreVoid: {
          type: "boolean",
        },
      },
      additionalProperties: false,
    },
  ]),
];

// The default options for the rule.
const defaultOptions: Options = {
  ignoreVoid: false,
};

// The possible error messages.
const errorMessages = {
  generic: "Using expressions to cause side-effects not allowed.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow expression statements.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given ExpressionStatement violates this rule.
 */
function checkExpressionStatement(
  node: TSESTree.ExpressionStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  // Allow specifying directive prologues.
  if (isDirectivePrologue(node)) {
    return {
      context,
      descriptors: [],
    };
  }

  if (options.ignoreVoid === true) {
    const type = getTypeOfNode(node.expression, context);

    return {
      context,
      descriptors:
        type !== null && isVoidType(type)
          ? []
          : [{ node, messageId: "generic" }],
    };
  }

  return {
    context,
    descriptors: [{ node, messageId: "generic" }],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ExpressionStatement: checkExpressionStatement,
  },
  [shouldIgnorePattern]
);
