import type { TSESTree } from "@typescript-eslint/experimental-utils";
import type { JSONSchema4 } from "json-schema";
import type { Type } from "typescript";

import tsutils from "~/conditional-imports/tsutils";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule, getTypeOfNode } from "~/util/rule";
import {
  isBlockStatement,
  isBreakStatement,
  isContinueStatement,
  isExpressionStatement,
  isIfStatement,
  isNeverType,
  isReturnStatement,
  isSwitchStatement,
  isThrowStatement,
} from "~/util/typeguard";

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
    "Incomplete switch, it must be exhaustive or have an default case and every case must contain a return statement.",
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
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * Report the given node as an incomplete branch violation.
 *
 * @param node - The node to report.
 * @returns A violation rule result.
 */
function incompleteBranchViolation(
  node: TSESTree.Node
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  return [{ node, messageId: "incompleteBranch" }];
}

/**
 * Get a function that tests if the given statement is never returning.
 */
function getIsNeverExpressions(
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  return (statement: TSESTree.Statement) => {
    if (isExpressionStatement(statement)) {
      const expressionStatementType = getTypeOfNode(
        statement.expression,
        context
      );
      return (
        expressionStatementType !== null && isNeverType(expressionStatementType)
      );
    }
    return false;
  };
}

/**
 * Is the given statement, when inside an if statement, a returning branch?
 *
 * @param statement
 * @returns
 */
function isIfReturningBranch(statement: TSESTree.Statement) {
  return (
    // Another instance of this rule will check nested if statements.
    isIfStatement(statement) ||
    isReturnStatement(statement) ||
    isThrowStatement(statement) ||
    isBreakStatement(statement) ||
    isContinueStatement(statement)
  );
}

/**
 * Get all of the violations in the given if statement assuming if statements
 * are allowed.
 */
function getIfBranchViolations(
  node: TSESTree.IfStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const branches = [node.consequent, node.alternate];
  const violations = branches.filter<NonNullable<typeof branches[0]>>(
    (branch): branch is NonNullable<typeof branch> => {
      if (branch === null || isIfReturningBranch(branch)) {
        return false;
      }

      if (isExpressionStatement(branch)) {
        const expressionStatementType = getTypeOfNode(
          branch.expression,
          context
        );

        if (
          expressionStatementType !== null &&
          isNeverType(expressionStatementType)
        ) {
          return false;
        }
      }

      if (isBlockStatement(branch)) {
        if (branch.body.some(isIfReturningBranch)) {
          return false;
        }

        const isNeverExpressions = getIsNeverExpressions(context);
        if (branch.body.some(isNeverExpressions)) {
          return false;
        }
      }

      return true;
    }
  );

  return violations.flatMap(incompleteBranchViolation);
}

/**
 * Is the given statement, when inside a switch statement, a returning branch?
 *
 * @param statement
 * @returns
 */
function isSwitchReturningBranch(statement: TSESTree.Statement) {
  return (
    // Another instance of this rule will check nested switch statements.
    isSwitchStatement(statement) ||
    isReturnStatement(statement) ||
    isThrowStatement(statement)
  );
}

/**
 * Get all of the violations in the given switch statement assuming switch
 * statements are allowed.
 */
function getSwitchViolations(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const isNeverExpressions = getIsNeverExpressions(context);

  const violations = node.cases.filter((branch) => {
    if (branch.consequent.length === 0) {
      return false;
    }
    if (branch.consequent.some(isSwitchReturningBranch)) {
      return false;
    }

    if (branch.consequent.every(isBlockStatement)) {
      const lastBlock = branch.consequent[branch.consequent.length - 1];

      if (lastBlock.body.some(isSwitchReturningBranch)) {
        return false;
      }

      if (lastBlock.body.some(isNeverExpressions)) {
        return false;
      }
    }

    if (branch.consequent.some(isNeverExpressions)) {
      return false;
    }

    return true;
  });

  return violations.flatMap(incompleteBranchViolation);
}

/**
 * Does the given if statement violate this rule if it must be exhaustive.
 */
function isExhaustiveIfViolation(node: TSESTree.IfStatement): boolean {
  return node.alternate === null;
}

/**
 * Does the given typed switch statement violate this rule if it must be exhaustive.
 */
function isExhaustiveTypeSwitchViolation(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): boolean {
  if (tsutils === undefined) {
    return true;
  }

  const discriminantType = getTypeOfNode(node.discriminant, context);
  if (discriminantType === null || !discriminantType.isUnion()) {
    return true;
  }

  const unionTypes = tsutils.unionTypeParts(discriminantType);
  const caseTypes = node.cases.reduce<ReadonlySet<Type>>(
    (types, c) => new Set([...types, getTypeOfNode(c.test!, context)!]),
    new Set()
  );

  return unionTypes.some((unionType) => !caseTypes.has(unionType));
}

/**
 * Does the given switch statement violate this rule if it must be exhaustive.
 */
function isExhaustiveSwitchViolation(
  node: TSESTree.SwitchStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): boolean {
  return (
    // No cases defined.
    node.cases.length === 0 ||
      // No default case defined.
      node.cases.every((c) => c.test !== null)
      ? isExhaustiveTypeSwitchViolation(node, context)
      : false
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
    descriptors:
      options.allowReturningBranches === false
        ? [{ node, messageId: "unexpectedIf" }]
        : options.allowReturningBranches === "ifExhaustive"
        ? isExhaustiveIfViolation(node)
          ? [{ node, messageId: "incompleteIf" }]
          : getIfBranchViolations(node, context)
        : getIfBranchViolations(node, context),
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
    descriptors:
      options.allowReturningBranches === false
        ? [{ node, messageId: "unexpectedSwitch" }]
        : options.allowReturningBranches === "ifExhaustive"
        ? isExhaustiveSwitchViolation(node, context)
          ? [{ node, messageId: "incompleteSwitch" }]
          : getSwitchViolations(node, context)
        : getSwitchViolations(node, context),
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
