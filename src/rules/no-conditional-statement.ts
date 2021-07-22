import { TSESTree } from "@typescript-eslint/experimental-utils";
import { JSONSchema4 } from "json-schema";

import {
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult,
} from "../util/rule";
import {
  isBlockStatement,
  isIfStatement,
  isReturnStatement,
} from "../util/typeguard";

// The name of this rule.
export const name = "no-conditional-statement" as const;

// The options this rule can take.
type Options = {
  readonly allowReturningBranches: boolean | "ifExhaustive";
};

// The schema for the rule options.
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowReturningBranches: {
        oneOf: [
          {
            type: "boolean",
          },
          {
            type: "string",
            enum: ["ifExhaustive"],
          },
        ],
      },
    },
    additionalProperties: false,
  },
];

// The default options for the rule.
const defaultOptions: Options = { allowReturningBranches: false };

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
    "Unexpected switch, use a conditional expression (ternary operator) instead.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow conditional statements.",
    category: "Best Practices",
    recommended: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Get all of the violations in the given if statement assuming if statements
 * are allowed.
 */
function getIfBranchViolations(
  node: TSESTree.IfStatement
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const branches = [node.consequent, node.alternate];
  const violations = branches.filter<NonNullable<typeof branches[0]>>(
    (branch): branch is NonNullable<typeof branch> =>
      branch !== null &&
      !isReturnStatement(branch) &&
      !(
        isBlockStatement(branch) &&
        branch.body.some(
          (statement) =>
            isReturnStatement(statement) ||
            // Another instance of this rule will check nested if statements.
            isIfStatement(statement)
        )
      ) &&
      !isIfStatement(branch)
  );

  return violations.flatMap((node) => [
    { node, messageId: "incompleteBranch" },
  ]);
}

/**
 * Get all of the violations in the given switch statement assuming switch
 * statements are allowed.
 */
function getSwitchViolations(
  node: TSESTree.SwitchStatement
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const violations = node.cases.filter(
    (branch) =>
      branch.consequent.length !== 0 &&
      !branch.consequent.some(isReturnStatement) &&
      !(
        branch.consequent.every(isBlockStatement) &&
        (
          branch.consequent[
            branch.consequent.length - 1
          ] as TSESTree.BlockStatement
        ).body.some(isReturnStatement)
      )
  );

  return violations.flatMap((node) => [
    { node, messageId: "incompleteBranch" },
  ]);
}

/**
 * Does the given if statement violate this rule if it must be exhaustive.
 */
function isExhaustiveIfViolation(node: TSESTree.IfStatement): boolean {
  return node.alternate === null;
}

/**
 * Does the given switch statement violate this rule if it must be exhaustive.
 */
function isExhaustiveSwitchViolation(node: TSESTree.SwitchStatement): boolean {
  return (
    // No cases defined.
    node.cases.length === 0 ||
    // No default case defined.
    node.cases.every((c) => c.test !== null)
  );
}

/**
 * Check if the given IfStatement violates this rule.
 */
function checkIfStatement(
  node: TSESTree.IfStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: options.allowReturningBranches
      ? options.allowReturningBranches === "ifExhaustive"
        ? isExhaustiveIfViolation(node)
          ? [{ node, messageId: "incompleteIf" }]
          : getIfBranchViolations(node)
        : getIfBranchViolations(node)
      : [{ node, messageId: "unexpectedIf" }],
  };
}

/**
 * Check if the given SwitchStatement violates this rule.
 */
function checkSwitchStatement(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: options.allowReturningBranches
      ? options.allowReturningBranches === "ifExhaustive"
        ? isExhaustiveSwitchViolation(node)
          ? [{ node, messageId: "incompleteSwitch" }]
          : getSwitchViolations(node)
        : getSwitchViolations(node)
      : [{ node, messageId: "unexpectedSwitch" }],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    IfStatement: checkIfStatement,
    SwitchStatement: checkSwitchStatement,
  }
);
