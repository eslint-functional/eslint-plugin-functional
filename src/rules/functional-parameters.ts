import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isPropertyAccess, isPropertyName } from "../util/tree";
import { isRestElement } from "../util/typeguard";

// The name of this rule.
export const name = "functional-parameters" as const;

// The options this rule can take.
type Options = ignore.IgnorePatternOption & {
  readonly allowRestParameter: boolean;
  readonly allowArgumentsKeyword: boolean;
  readonly enforceParameterCount: false | "atLeastOne" | "exactlyOne";
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignorePatternOptionSchema,
    {
      type: "object",
      properties: {
        allowRestParameter: {
          type: "boolean"
        },
        allowArgumentsKeyword: {
          type: "boolean"
        },
        enforceParameterCount: {
          oneOf: [
            {
              type: "boolean",
              enum: [false]
            },
            {
              type: "string",
              enum: ["atLeastOne", "exactlyOne"]
            }
          ]
        }
      },
      additionalProperties: false
    }
  ])
];

// The default options for the rule.
const defaultOptions: Options = {
  allowRestParameter: false,
  allowArgumentsKeyword: false,
  enforceParameterCount: "atLeastOne"
};

// The possible error messages.
const errorMessages = {
  restParam:
    "Unexpected rest parameter. Use a regular parameter of type array instead.",
  arguments:
    "Unexpected use of `arguments`. Use regular function arguments instead.",
  paramCountAtLeastOne: "Functions must have at least one parameter.",
  paramCountExactlyOne: "Functions must have exactly one parameter."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce functional parameters.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

/**
 * Check if the given function node has a reset parameter this rule.
 */
function checkFunction(
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: [
      ...getRestParamViolations(options.allowRestParameter, node),
      ...getParamCountViolations(options.enforceParameterCount, node)
    ]
  };
}

function getRestParamViolations(
  allowRestParameter: boolean,
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  return !allowRestParameter &&
    node.params.length > 0 &&
    isRestElement(node.params[node.params.length - 1])
    ? [
        {
          node: node.params[node.params.length - 1],
          messageId: "restParam"
        }
      ]
    : [];
}

function getParamCountViolations(
  enforceParameterCount: Options["enforceParameterCount"],
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  return enforceParameterCount === "atLeastOne" && node.params.length < 1
    ? [
        {
          node: node,
          messageId: "paramCountAtLeastOne"
        }
      ]
    : enforceParameterCount === "exactlyOne" && node.params.length !== 1
    ? [
        {
          node: node,
          messageId: "paramCountExactlyOne"
        }
      ]
    : [];
}

/**
 * Check if the given identifier is for the "arguments" keyword.
 */
function checkIdentifier(
  node: TSESTree.Identifier,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      !options.allowArgumentsKeyword &&
      node.name === "arguments" &&
      !isPropertyName(node) &&
      !isPropertyAccess(node)
        ? [
            {
              node,
              messageId: "arguments"
            }
          ]
        : []
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  (context, options) => {
    const _checkFunction = checkNode(checkFunction, context, options);
    const _checkIdentifier = checkNode(checkIdentifier, context, options);

    return {
      FunctionDeclaration: _checkFunction,
      FunctionExpression: _checkFunction,
      ArrowFunctionExpression: _checkFunction,
      Identifier: _checkIdentifier
    };
  }
);
