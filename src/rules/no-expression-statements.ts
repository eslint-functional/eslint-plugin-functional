import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";

import tsApiUtils from "~/conditional-imports/ts-api-utils";
import type { IgnorePatternOption } from "~/options";
import { shouldIgnorePattern, ignorePatternOptionSchema } from "~/options";
import { isDirectivePrologue } from "~/utils/misc";
import type { RuleResult, NamedCreateRuleMetaWithCategory } from "~/utils/rule";
import { createRule, getTypeOfNode } from "~/utils/rule";
import { isYieldExpression } from "~/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-expression-statements" as const;

/**
 * The options this rule can take.
 */
type Options = [
  IgnorePatternOption & {
    ignoreVoid: boolean;
  }
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(ignorePatternOptionSchema, {
      ignoreVoid: {
        type: "boolean",
      },
    }),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreVoid: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Using expressions to cause side-effects not allowed.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Statements",
    description: "Disallow expression statements.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given ExpressionStatement violates this rule.
 */
function checkExpressionStatement(
  node: TSESTree.ExpressionStatement,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignorePattern } = optionsObject;

  if (shouldIgnorePattern(node, context, ignorePattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  // Allow specifying directive prologues and using yield expressions.
  if (isDirectivePrologue(node) || isYieldExpression(node.expression)) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreVoid } = optionsObject;

  if (ignoreVoid === true) {
    const type = getTypeOfNode(node.expression, context);

    return {
      context,
      descriptors:
        type !== null && tsApiUtils?.isIntrinsicVoidType(type) === true
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
  }
);
