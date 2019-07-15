import { TSESTree } from "@typescript-eslint/typescript-estree";
import { JSONSchema4 } from "json-schema";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import {
  isBlockStatement,
  isIfStatement,
  isReturnStatement
} from "../util/typeguard";

// The name of this rule.
export const name = "no-conditional-statement" as const;

// The options this rule can take.
type Options = readonly [{ readonly allowReturningBranches: boolean }];

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowReturningBranches: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];

// The default options for the rule.
const defaultOptions: Options = [{ allowReturningBranches: false }];

// The possible error messages.
const errorMessages = {
  incompleteIf: "Incomplete if, every branch must contain a return statement.",
  incompleteSwitch:
    "Incomplete switch, every case must contain a return statement.",
  unexpectedIf:
    "Unexpected if, use a conditional expression (ternary operator) instead.",
  unexpectedSwitch:
    "Unexpected switch, use a conditional expression (ternary operator) instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow if statements.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

function isIfReturningStatement(node: TSESTree.IfStatement): boolean {
  return [node.consequent, node.alternate].every(
    branch =>
      branch === null ||
      isReturnStatement(branch) ||
      (isBlockStatement(branch) &&
        branch.body.some(
          statement =>
            isReturnStatement(statement) ||
            // Another instance of this rule will check nested if statements.
            isIfStatement(statement)
        )) ||
      isIfStatement(branch)
  );
}

function isSwitchReturningStatement(node: TSESTree.SwitchStatement): boolean {
  return node.cases.every(c => c.consequent.some(isReturnStatement));
}

/**
 * Check if the given IfStatement violates this rule.
 */
function checkIfStatement(
  node: TSESTree.IfStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: options.allowReturningBranches
      ? isIfReturningStatement(node)
        ? []
        : [{ node, messageId: "incompleteIf" }]
      : [{ node, messageId: "unexpectedIf" }]
  };
}

/**
 * Check if the given SwitchStatement violates this rule.
 */
function checkSwitchStatement(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: options.allowReturningBranches
      ? isSwitchReturningStatement(node)
        ? []
        : [{ node, messageId: "incompleteSwitch" }]
      : [{ node, messageId: "unexpectedSwitch" }]
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkIfStatement = checkNode(
      checkIfStatement,
      context,
      undefined,
      options
    );
    const _checkSwitchStatement = checkNode(
      checkSwitchStatement,
      context,
      undefined,
      options
    );

    return {
      IfStatement: _checkIfStatement,
      SwitchStatement: _checkSwitchStatement
    };
  }
});
