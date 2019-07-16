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
type Options = readonly [
  {
    readonly allowReturningBranches: boolean | "onlyIfExhaustive";
  }
];

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowReturningBranches: {
        oneOf: [
          {
            type: "boolean"
          },
          {
            type: "string",
            enum: ["onlyIfExhaustive"]
          }
        ]
      }
    },
    additionalProperties: false
  }
];

// The default options for the rule.
const defaultOptions: Options = [{ allowReturningBranches: false }];

// The possible error messages.
const errorMessages = {
  incompleteBranch:
    "Incomplete branch, every branch in a conditional statement must contain a return statement.",
  incompleteIf:
    "Incomplete if, it must have an else statement and every branch must contain a return statement.",
  incompleteSwitch:
    "Incomplete switch, it must have an default case and every case must contain a return statement.",
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

function getIfBranchViolations(
  node: TSESTree.IfStatement
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const nodes = [node.consequent, node.alternate].reduce<
    ReadonlyArray<TSESTree.Node>
  >(
    (carry, branch) =>
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
        ? carry
        : [...carry, branch],
    []
  );

  return nodes.flatMap(node => [{ node, messageId: "incompleteBranch" }]);
}

function getSwitchCaseViolations(
  node: TSESTree.SwitchStatement
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const nodes = node.cases.reduce<ReadonlyArray<TSESTree.Node>>(
    (carry, branch) =>
      branch.consequent.length === 0 ||
      branch.consequent.some(isReturnStatement) ||
      (branch.consequent.every(isBlockStatement) &&
        (branch.consequent[
          branch.consequent.length - 1
        ] as TSESTree.BlockStatement).body.some(isReturnStatement))
        ? carry
        : [...carry, branch],
    []
  );

  return nodes.flatMap(node => [{ node, messageId: "incompleteBranch" }]);
}

function isExhaustiveIfViolation(node: TSESTree.IfStatement): boolean {
  return node.alternate === null;
}

function isExhaustiveSwitchViolation(node: TSESTree.SwitchStatement): boolean {
  return (
    // No cases defined.
    node.cases.length === 0 ||
    // No default case defined.
    node.cases.every(c => c.test !== null)
  );
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
      ? options.allowReturningBranches === "onlyIfExhaustive"
        ? isExhaustiveIfViolation(node)
          ? [{ node, messageId: "incompleteIf" }]
          : getIfBranchViolations(node)
        : getIfBranchViolations(node)
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
      ? options.allowReturningBranches === "onlyIfExhaustive"
        ? isExhaustiveSwitchViolation(node)
          ? [{ node, messageId: "incompleteSwitch" }]
          : getSwitchCaseViolations(node)
        : getSwitchCaseViolations(node)
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
