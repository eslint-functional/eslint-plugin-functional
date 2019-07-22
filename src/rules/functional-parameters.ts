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
import { isIIFE, isPropertyAccess, isPropertyName } from "../util/tree";
import { isRestElement } from "../util/typeguard";

// The name of this rule.
export const name = "functional-parameters" as const;

type ParameterCountOptions = "atLeastOne" | "exactlyOne";

// The options this rule can take.
type Options = ignore.IgnorePatternOption & {
  readonly allowRestParameter: boolean;
  readonly allowArgumentsKeyword: boolean;
  readonly enforceParameterCount:
    | false
    | ParameterCountOptions
    | {
        readonly count: ParameterCountOptions;
        readonly allowIIFE: boolean;
      };
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
            },
            {
              type: "object",
              properties: {
                count: {
                  type: "string",
                  enum: ["atLeastOne", "exactlyOne"]
                },
                allowIIFE: {
                  type: "boolean"
                }
              },
              additionalProperties: false
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
  enforceParameterCount: {
    count: "atLeastOne",
    allowIIFE: false
  }
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
 * Get the rest parameter violations.
 */
function getRestParamViolations(
  allowRestParameter: Options["allowRestParameter"],
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

/**
 * Get the parameter count violations.
 */
function getParamCountViolations(
  enforceParameterCount: Options["enforceParameterCount"],
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  if (
    enforceParameterCount === false ||
    (node.params.length === 0 &&
      typeof enforceParameterCount === "object" &&
      enforceParameterCount.allowIIFE &&
      isIIFE(node))
  ) {
    return [];
  } else if (
    node.params.length === 0 &&
    (enforceParameterCount === "atLeastOne" ||
      (typeof enforceParameterCount === "object" &&
        enforceParameterCount.count === "atLeastOne"))
  ) {
    return [
      {
        node,
        messageId: "paramCountAtLeastOne"
      }
    ];
  } else if (
    node.params.length !== 1 &&
    (enforceParameterCount === "exactlyOne" ||
      (typeof enforceParameterCount === "object" &&
        enforceParameterCount.count === "exactlyOne"))
  ) {
    return [
      {
        node,
        messageId: "paramCountExactlyOne"
      }
    ];
  } else {
    return [];
  }
}

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
