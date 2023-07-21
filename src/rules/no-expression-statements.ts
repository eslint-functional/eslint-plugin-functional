import { type TSESTree } from "@typescript-eslint/utils";
import {
  type JSONSchema4,
  type JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import { isThisKeyword } from "ts-api-utils";

import tsApiUtils from "#eslint-plugin-functional/conditional-imports/ts-api-utils";
import typescript from "#eslint-plugin-functional/conditional-imports/typescript";
import { type IgnorePatternOption } from "#eslint-plugin-functional/options";
import {
  shouldIgnorePattern,
  ignorePatternOptionSchema,
} from "#eslint-plugin-functional/options";
import { isDirectivePrologue } from "#eslint-plugin-functional/utils/misc";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
} from "#eslint-plugin-functional/utils/rule";
import {
  createRule,
  getTypeOfNode,
} from "#eslint-plugin-functional/utils/rule";
import {
  isCallExpression,
  isYieldExpression,
} from "#eslint-plugin-functional/utils/type-guards";

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
    ignoreSelfReturning: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(ignorePatternOptionSchema, {
      ignoreVoid: {
        type: "boolean",
      },
      ignoreSelfReturning: {
        type: "boolean",
      },
    } satisfies JSONSchema4ObjectSchema["properties"]),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreVoid: false,
    ignoreSelfReturning: false,
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
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

  const { ignoreVoid, ignoreSelfReturning } = optionsObject;

  if (
    (ignoreVoid || ignoreSelfReturning) &&
    isCallExpression(node.expression)
  ) {
    const returnType = getTypeOfNode(node.expression, context);
    if (returnType === null) {
      return {
        context,
        descriptors: [{ node, messageId: "generic" }],
      };
    }

    if (ignoreVoid && tsApiUtils?.isIntrinsicVoidType(returnType) === true) {
      return {
        context,
        descriptors: [],
      };
    }

    if (ignoreSelfReturning) {
      const type = getTypeOfNode(node.expression.callee, context);
      if (type !== null) {
        const declaration = type.getSymbol()?.valueDeclaration;
        if (
          typescript !== undefined &&
          declaration !== undefined &&
          typescript.isFunctionLike(declaration) &&
          "body" in declaration &&
          declaration.body !== undefined &&
          typescript.isBlock(declaration.body)
        ) {
          const returnStatements = declaration.body.statements.filter(
            typescript.isReturnStatement,
          );

          if (
            returnStatements.every(
              (statement) =>
                statement.expression !== undefined &&
                isThisKeyword(statement.expression),
            )
          ) {
            return {
              context,
              descriptors: [],
            };
          }
        }
      }
    }
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
);
