import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { ReportDescriptor } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";
import type { FunctionLikeDeclaration, Type } from "typescript";

import type { IgnorePatternOption } from "~/common/ignore-options";
import { ignorePatternOptionSchema } from "~/common/ignore-options";
import type { RuleContext, RuleMetaData, RuleResult } from "~/utils/rule";
import { createRule, getESTreeNode, getTypeOfNode } from "~/utils/rule";
import {
  isBlockStatement,
  isCallExpression,
  isFunctionLike,
  isIdentifier,
  isReturnStatement,
  isTSFunctionType,
} from "~/utils/typeguard";

// The name of this rule.
export const name = "prefer-tacit" as const;

// The options this rule can take.
type Options = IgnorePatternOption & {
  readonly assumeTypes:
    | false
    | {
        readonly allowFixer: boolean;
      };
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignorePatternOptionSchema,
    {
      type: "object",
      properties: {
        ignoreImmediateMutation: {
          type: "boolean",
        },
        assumeTypes: {
          oneOf: [
            {
              type: "boolean",
              enum: [false],
            },
            {
              type: "object",
              properties: {
                allowFixer: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
          ],
        },
      },
      additionalProperties: false,
    },
  ]),
];

// The default options for the rule.
const defaultOptions: Options = {
  assumeTypes: false,
};

// The possible error messages.
const errorMessages = {
  generic: "Potentially unnecessary function wrapper.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Replaces `x => f(x)` with just `f`.",
    category: "Best Practices",
    recommended: "warn",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

/**
 * From the callee's type, does it follow that the caller violates this rule.
 */
function isCallerViolation(
  caller: TSESTree.CallExpression,
  calleeType: Type,
  context: RuleContext<keyof typeof errorMessages, Options>
): boolean {
  if (calleeType.symbol === undefined) {
    return false;
  }
  const tsDeclaration =
    calleeType.symbol.valueDeclaration ?? calleeType.symbol.declarations?.[0];

  if (tsDeclaration === undefined) {
    return false;
  }
  const declaration = getESTreeNode(tsDeclaration, context);

  return (
    (declaration !== null &&
      (isFunctionLike(declaration) || isTSFunctionType(declaration)) &&
      declaration.params.length === caller.arguments.length) ||
    // Check for optional params.
    (tsDeclaration as FunctionLikeDeclaration).parameters
      .slice(caller.arguments.length)
      .every(
        (param) =>
          param.initializer !== undefined || param.questionToken !== undefined
      )
  );
}

/**
 * Check for violations based on the given caller.
 */
function getCallDescriptors(
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options,
  caller: TSESTree.CallExpression
): Array<ReportDescriptor<keyof typeof errorMessages>> {
  if (
    isIdentifier(caller.callee) &&
    node.params.length === caller.arguments.length &&
    node.params.every((param, index) => {
      const callArg = caller.arguments[index];
      return (
        isIdentifier(callArg) &&
        isIdentifier(param) &&
        callArg.name === param.name
      );
    })
  ) {
    const calleeType = getTypeOfNode(caller.callee, context);
    const assumingTypes =
      (calleeType === null || calleeType.symbol === undefined) &&
      options.assumeTypes !== false;

    if (
      assumingTypes ||
      (calleeType !== null && isCallerViolation(caller, calleeType, context))
    ) {
      const calleeName = caller.callee.name;
      return [
        {
          node,
          messageId: "generic",
          fix:
            // No fixer when assuming types as this is dangerous.
            (typeof options.assumeTypes !== "object" && assumingTypes) ||
            // Unless user specifies they want it.
            (typeof options.assumeTypes === "object" &&
              !options.assumeTypes.allowFixer)
              ? undefined
              : (fixer) => fixer.replaceText(node, calleeName),
        },
      ];
    }
    return [];
  }
  return [];
}

/**
 * Check for violations in the form: `x => f(x)`.
 */
function getDirectCallDescriptors(
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): Array<ReportDescriptor<keyof typeof errorMessages>> {
  if (isCallExpression(node.body)) {
    return getCallDescriptors(node, context, options, node.body);
  }
  return [];
}

/**
 * Check for violations in the form: `x => { return f(x); }`.
 */
function getNestedCallDescriptors(
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): Array<ReportDescriptor<keyof typeof errorMessages>> {
  if (
    isBlockStatement(node.body) &&
    node.body.body.length === 1 &&
    isReturnStatement(node.body.body[0]) &&
    node.body.body[0].argument !== null &&
    isCallExpression(node.body.body[0].argument)
  ) {
    return getCallDescriptors(
      node,
      context,
      options,
      node.body.body[0].argument
    );
  }
  return [];
}

/**
 * Check if the given function node violates this rule.
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
      ...getDirectCallDescriptors(node, context, options),
      ...getNestedCallDescriptors(node, context, options),
    ],
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
  }
);
