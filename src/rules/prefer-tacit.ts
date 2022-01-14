import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { ReportDescriptor } from "@typescript-eslint/utils/dist/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";
import type { FunctionLikeDeclaration, Type } from "typescript";

import type { IgnorePatternOption } from "~/common/ignore-options";
import { ignorePatternOptionSchema } from "~/common/ignore-options";
import type { RuleResult } from "~/util/rule";
import { createRule, getESTreeNode, getTypeOfNode } from "~/util/rule";
import {
  isBlockStatement,
  isCallExpression,
  isDefined,
  isFunctionLike,
  isIdentifier,
  isReturnStatement,
  isTSFunctionType,
} from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "prefer-tacit" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  IgnorePatternOption &
    Readonly<{
      assumeTypes:
        | false
        | Readonly<{
            allowFixer: boolean;
          }>;
    }>
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(ignorePatternOptionSchema, {
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
    }),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    assumeTypes: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Potentially unnecessary function wrapper.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Replaces `x => f(x)` with just `f`.",
    recommended: false,
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

/**
 * From the callee's type, does it follow that the caller violates this rule.
 */
function isCallerViolation(
  caller: ReadonlyDeep<TSESTree.CallExpression>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  calleeType: Type,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >
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
    (isDefined(declaration) &&
      (isFunctionLike(declaration) || isTSFunctionType(declaration)) &&
      declaration.params.length === caller.arguments.length) ||
    // Check for optional params.
    ((tsDeclaration as FunctionLikeDeclaration).parameters !== undefined &&
      (tsDeclaration as FunctionLikeDeclaration).parameters
        .slice(caller.arguments.length)
        .every(
          (param) =>
            param.initializer !== undefined || param.questionToken !== undefined
        ))
  );
}

/**
 * Check for violations based on the given caller.
 */
function getCallDescriptors(
  node:
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options,
  caller: ReadonlyDeep<TSESTree.CallExpression>
): Array<ReadonlyDeep<ReportDescriptor<keyof typeof errorMessages>>> {
  const [{ assumeTypes }] = options;

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
      assumeTypes !== false;

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
            (typeof assumeTypes !== "object" && assumingTypes) ||
            // Unless user specifies they want it.
            (typeof assumeTypes === "object" && !assumeTypes.allowFixer)
              ? null
              : (fixer) => fixer.replaceText(node as TSESTree.Node, calleeName),
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
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): Array<ReadonlyDeep<ReportDescriptor<keyof typeof errorMessages>>> {
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
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): Array<ReadonlyDeep<ReportDescriptor<keyof typeof errorMessages>>> {
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
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
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
