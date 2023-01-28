import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import * as semver from "semver";
import type { Type } from "typescript";

import ts from "~/conditional-imports/typescript";
import type { IgnorePatternOption } from "~/options";
import { ignorePatternOptionSchema } from "~/options";
import type { ESFunction } from "~/utils/node-types";
import type { RuleResult, NamedCreateRuleMetaWithCategory } from "~/utils/rule";
import { createRule, getESTreeNode, getTypeOfNode } from "~/utils/rule";
import {
  isBlockStatement,
  isCallExpression,
  isDefined,
  isFunctionLike,
  isIdentifier,
  isReturnStatement,
  isTSFunctionType,
} from "~/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "prefer-tacit" as const;

/**
 * The options this rule can take.
 */
type Options = [
  IgnorePatternOption & {
    assumeTypes:
      | false
      | {
          allowFixer: boolean;
        };
  }
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
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Stylistic",
    description: "Replaces `x => f(x)` with just `f`.",
    recommended: false,
  },
  messages: errorMessages,
  fixable: "code",
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
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>
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

function fixFunctionCallToReference(
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  fixer: TSESLint.RuleFixer,
  node: ESFunction,
  caller: TSESTree.CallExpression
): TSESLint.RuleFix[] | null {
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
      context.getSourceCode().getText(caller.callee as TSESTree.Node)
    ),
  ];
}

/**
 * Creates the fixer function that returns the instruction how to fix violations of this rule to valid code
 */
function buildFixer(
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  node: ESFunction,
  caller: TSESTree.CallExpression
): TSESLint.ReportFixFunction {
  return (fixer) => {
    const functionCallToReference = fixFunctionCallToReference(
      context,
      fixer,
      node,
      caller
    );
    if (functionCallToReference === null) {
      return null;
    }

    if (node.type === "FunctionDeclaration") {
      if (node.id === null) {
        return null;
      }

      return [
        fixer.insertTextBefore(
          node as TSESTree.Node,
          `const ${node.id.name} = `
        ),
        fixer.insertTextAfter(node as TSESTree.Node, `;`),
        ...functionCallToReference,
      ];
    }

    return functionCallToReference;
  };
}

/**
 * Check for violations based on the given caller.
 */
function getCallDescriptors(
  node: ESFunction,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options,
  caller: TSESTree.CallExpression
): Array<TSESLint.ReportDescriptor<keyof typeof errorMessages>> {
  const [{ assumeTypes }] = options;

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
    const assumingTypes =
      (calleeType === null || (calleeType.symbol as unknown) === undefined) &&
      assumeTypes !== false;

    if (
      assumingTypes ||
      (calleeType !== null && isCallerViolation(caller, calleeType, context))
    ) {
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
              : buildFixer(context, node, caller),
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
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): Array<TSESLint.ReportDescriptor<keyof typeof errorMessages>> {
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
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): Array<TSESLint.ReportDescriptor<keyof typeof errorMessages>> {
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
      node.body.body[0].argument
    );
  }
  return [];
}

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node: ESFunction,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
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
