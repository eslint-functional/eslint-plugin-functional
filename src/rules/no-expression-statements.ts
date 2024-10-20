import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import type ts from "typescript";

import tsApiUtils from "#/conditional-imports/ts-api-utils";
import typescript from "#/conditional-imports/typescript";
import { type IgnoreCodePatternOption, ignoreCodePatternOptionSchema, shouldIgnorePattern } from "#/options";
import { isDirectivePrologue, ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule, getTypeOfNode } from "#/utils/rule";
import { isCallExpression, isPromiseType, isYieldExpression } from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-expression-statements";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreCodePatternOption & {
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
    properties: deepmerge(ignoreCodePatternOptionSchema, {
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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Statements",
    description: "Disallow expression statements.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
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
  const { ignoreCodePattern } = optionsObject;

  if (shouldIgnorePattern(node, context, undefined, undefined, ignoreCodePattern)) {
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

  if ((ignoreVoid || ignoreSelfReturning) && isCallExpression(node.expression)) {
    const returnType = getTypeOfNode(node.expression, context);
    if (returnType === null) {
      return {
        context,
        descriptors: [{ node, messageId: "generic" }],
      };
    }

    if (
      ignoreVoid &&
      (tsApiUtils?.isIntrinsicVoidType(returnType) === true ||
        ("typeArguments" in returnType &&
          isPromiseType(context, returnType) &&
          (returnType.typeArguments as ts.Type[]).length > 0 &&
          tsApiUtils?.isIntrinsicVoidType((returnType.typeArguments as ts.Type[])[0]!) === true))
    ) {
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
          !typescript.isArrowFunction(declaration) &&
          "body" in declaration &&
          declaration.body !== undefined &&
          typescript.isBlock(declaration.body)
        ) {
          const returnStatements = declaration.body.statements.filter(typescript.isReturnStatement);

          if (
            returnStatements.every(
              (statement) => statement.expression !== undefined && tsApiUtils?.isThisKeyword(statement.expression),
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
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ExpressionStatement: checkExpressionStatement,
  },
);
