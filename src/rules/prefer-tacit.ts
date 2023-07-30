import { TSESTree } from "@typescript-eslint/utils";
import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import {
  type RuleFix,
  type RuleFixer,
  type RuleContext,
  type ReportDescriptor,
  type ReportSuggestionArray,
} from "@typescript-eslint/utils/ts-eslint";
import * as semver from "semver";
import { type Type } from "typescript";

import ts from "#eslint-plugin-functional/conditional-imports/typescript";
import { type ESFunction } from "#eslint-plugin-functional/utils/node-types";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
  createRule,
  getESTreeNode,
  getTypeOfNode,
} from "#eslint-plugin-functional/utils/rule";
import { isNested } from "#eslint-plugin-functional/utils/tree";
import {
  isBlockStatement,
  isCallExpression,
  isDefined,
  isFunctionLike,
  isIdentifier,
  isReturnStatement,
  isTSFunctionType,
} from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "prefer-tacit" as const;

/**
 * The options this rule can take.
 */
type Options = [];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Potentially unnecessary function wrapper.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description: "Replaces `x => f(x)` with just `f`.",
  },
  messages: errorMessages,
  hasSuggestions: true,
  schema,
};

/**
 * Is the version of TypeScript being used 4.7 or newer?
 */
const isTS4dot7 =
  ts !== undefined &&
  semver.satisfies(ts.version, `>= 4.7.0 || >= 4.7.1-rc || >= 4.7.0-beta`, {
    includePrerelease: true,
  });

/**
 * From the callee's type, does it follow that the caller violates this rule.
 */
function isCallerViolation(
  caller: TSESTree.CallExpression,
  calleeType: Type,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): boolean {
  if ((calleeType.symbol as unknown) === undefined) {
    return false;
  }
  const tsDeclaration =
    calleeType.symbol.valueDeclaration ?? calleeType.symbol.declarations?.[0];

  if (tsDeclaration === undefined) {
    return false;
  }
  const declaration = getESTreeNode(tsDeclaration, context);

  return (
    isDefined(declaration) &&
    (isFunctionLike(declaration) || isTSFunctionType(declaration)) &&
    declaration.params.length === caller.arguments.length
  );
}

/**
 * Get the fixes for a call to a reference violation.
 */
function fixFunctionCallToReference(
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  fixer: RuleFixer,
  node: ESFunction,
  caller: TSESTree.CallExpression,
): RuleFix[] | null {
  // Fix to Instantiation Expression.
  if (
    caller.typeParameters !== undefined &&
    caller.typeParameters.params.length > 0
  ) {
    return isTS4dot7
      ? [
          fixer.removeRange([node.range[0], caller.callee.range[0]]),
          fixer.removeRange([caller.typeParameters.range[1], node.range[1]]),
        ]
      : null;
  }

  return [
    fixer.replaceText(
      node as TSESTree.Node,
      context.getSourceCode().getText(caller.callee as TSESTree.Node),
    ),
  ];
}

/**
 * Creates the suggestions.
 */
function buildSuggestions(
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  node: ESFunction,
  caller: TSESTree.CallExpression,
): ReportSuggestionArray<keyof typeof errorMessages> {
  return [
    {
      messageId: "generic",
      fix: (fixer) => {
        const functionCallToReference = fixFunctionCallToReference(
          context,
          fixer,
          node,
          caller,
        );
        if (functionCallToReference === null) {
          return null;
        }

        if (
          node.type === TSESTree.AST_NODE_TYPES.FunctionDeclaration &&
          !isNested(node)
        ) {
          if (node.id === null) {
            return null;
          }

          return [
            fixer.insertTextBefore(
              node as TSESTree.Node,
              `const ${node.id.name} = `,
            ),
            fixer.insertTextAfter(node as TSESTree.Node, `;`),
            ...functionCallToReference,
          ];
        }

        return functionCallToReference;
      },
    },
  ];
}

/**
 * Check for violations based on the given caller.
 */
function getCallDescriptors(
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Options,
  caller: TSESTree.CallExpression,
): Array<ReportDescriptor<keyof typeof errorMessages>> {
  if (
    node.params.length === caller.arguments.length &&
    node.params.every((param, index) => {
      const callArg = caller.arguments[index]!;
      return (
        isIdentifier(callArg) &&
        isIdentifier(param) &&
        callArg.name === param.name
      );
    })
  ) {
    const calleeType = getTypeOfNode(caller.callee, context);

    if (calleeType !== null && isCallerViolation(caller, calleeType, context)) {
      return [
        {
          node,
          messageId: "generic",
          suggest: buildSuggestions(context, node, caller),
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
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Options,
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
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Options,
): Array<ReportDescriptor<keyof typeof errorMessages>> {
  if (
    isBlockStatement(node.body) &&
    node.body.body.length === 1 &&
    isReturnStatement(node.body.body[0]!) &&
    node.body.body[0].argument !== null &&
    isCallExpression(node.body.body[0].argument)
  ) {
    return getCallDescriptors(
      node,
      context,
      options,
      node.body.body[0].argument,
    );
  }
  return [];
}

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Options,
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
  },
);
