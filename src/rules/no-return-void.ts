import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";

import type { RuleContext, RuleMetaData, RuleResult } from "~/utils/rule";
import { createRule } from "~/utils/rule";
import {
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSVoidKeyword,
} from "~/utils/typeguard";

// The name of this rule.
export const name = "no-return-void" as const;

// The options this rule can take.
type Options = {
  readonly allowNull: boolean;
  readonly allowUndefined: boolean;
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowNull: {
        type: "boolean",
      },
      allowUndefined: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
];

// The default options for the rule.
const defaultOptions: Options = {
  allowNull: true,
  allowUndefined: true,
};

// The possible error messages.
const errorMessages = {
  generic: "Function must return a value.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow functions that don't return anything.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | TSESTree.TSFunctionType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      node.returnType !== undefined &&
      (isTSVoidKeyword(node.returnType.typeAnnotation) ||
        (!options.allowNull &&
          isTSNullKeyword(node.returnType.typeAnnotation)) ||
        (!options.allowUndefined &&
          isTSUndefinedKeyword(node.returnType.typeAnnotation)))
        ? [{ node: node.returnType, messageId: "generic" }]
        : [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    FunctionDeclaration: checkFunction,
    FunctionExpression: checkFunction,
    ArrowFunctionExpression: checkFunction,
    TSFunctionType: checkFunction,
  }
);
