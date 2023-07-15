import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import tsApiUtils from "#eslint-plugin-functional/conditional-imports/ts-api-utils";
import { type ESFunctionType } from "#eslint-plugin-functional/utils/node-types";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
} from "#eslint-plugin-functional/utils/rule";
import {
  createRule,
  getTypeOfNode,
} from "#eslint-plugin-functional/utils/rule";
import {
  isFunctionLike,
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSVoidKeyword,
} from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "no-return-void" as const;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowNull: boolean;
    allowUndefined: boolean;
    ignoreInferredTypes: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: {
      allowNull: {
        type: "boolean",
      },
      allowUndefined: {
        type: "boolean",
      },
      ignoreInferredTypes: {
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
    ignoreInferredTypes: false,
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
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Statements",
    description: "Disallow functions that don't return anything.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node: ESFunctionType,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ ignoreInferredTypes, allowNull, allowUndefined }] = options;

  if (node.returnType === undefined) {
    if (!ignoreInferredTypes && isFunctionLike(node)) {
      const functionType = getTypeOfNode(node, context);
      const returnType = functionType
        ?.getCallSignatures()?.[0]
        ?.getReturnType();

      if (
        returnType !== undefined &&
        tsApiUtils !== undefined &&
        (tsApiUtils.isIntrinsicVoidType(returnType) ||
          (!allowNull && tsApiUtils.isIntrinsicNullType(returnType)) ||
          (!allowUndefined && tsApiUtils.isIntrinsicUndefinedType(returnType)))
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
    ArrowFunctionExpression: checkFunction,
    FunctionDeclaration: checkFunction,
    FunctionExpression: checkFunction,
    TSCallSignatureDeclaration: checkFunction,
    TSConstructSignatureDeclaration: checkFunction,
    TSDeclareFunction: checkFunction,
    TSEmptyBodyFunctionExpression: checkFunction,
    TSFunctionType: checkFunction,
    TSMethodSignature: checkFunction,
  },
);
