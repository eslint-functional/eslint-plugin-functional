import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { RuleResult } from "~/util/rule";
import { createRule, getTypeOfNode } from "~/util/rule";
import {
  isFunctionLike,
  isNullType,
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSVoidKeyword,
  isUndefinedType,
  isVoidType,
} from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "no-return-void" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  Readonly<{
    allowNull: boolean;
    allowUndefined: boolean;
    ignoreImplicit: boolean;
  }>
];

/**
 * The schema for the rule options.
 */
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
      ignoreImplicit: {
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
    allowNull: true,
    allowUndefined: true,
    ignoreImplicit: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Function must return a value.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow functions that don't return anything.",
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
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>
    | ReadonlyDeep<TSESTree.TSFunctionType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ ignoreImplicit, allowNull, allowUndefined }] = options;

  if (node.returnType === undefined) {
    if (!ignoreImplicit && isFunctionLike(node)) {
      const functionType = getTypeOfNode(node, context);
      const returnType = functionType
        ?.getCallSignatures()?.[0]
        ?.getReturnType();

      if (
        returnType !== undefined &&
        (isVoidType(returnType) ||
          (!allowNull && isNullType(returnType)) ||
          (!allowUndefined && isUndefinedType(returnType)))
      ) {
        return {
          context,
          descriptors: [{ node, messageId: "generic" }],
        };
      }
    }
  } else if (
    isTSVoidKeyword(node.returnType.typeAnnotation) ||
    (!allowNull && isTSNullKeyword(node.returnType.typeAnnotation)) ||
    (!allowUndefined && isTSUndefinedKeyword(node.returnType.typeAnnotation))
  ) {
    return {
      context,
      descriptors: [{ node: node.returnType, messageId: "generic" }],
    };
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
    FunctionDeclaration: checkFunction,
    FunctionExpression: checkFunction,
    ArrowFunctionExpression: checkFunction,
    TSFunctionType: checkFunction,
  }
);
