import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import type { Type } from "typescript";

import tsApiUtils from "#/conditional-imports/ts-api-utils";
import { ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule, getTypeOfNode } from "#/utils/rule";
import {
  isBlockStatement,
  isBreakStatement,
  isContinueStatement,
  isExpressionStatement,
  isIfStatement,
  isLabeledStatement,
  isReturnStatement,
  isSwitchStatement,
  isThrowStatement,
} from "#/utils/type-guards";

/**
 * The name of this .
 */
export const name = "no-conditional-statements";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowReturningBranches: boolean | "ifExhaustive";
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
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

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [{ allowReturningBranches: false }];

/**
 * The possible error messages.
 */
const errorMessages = {
  incompleteBranch: "Incomplete branch, every branch in a conditional statement must contain a return statement.",
  incompleteIf: "Incomplete if, it must have an else statement and every branch must contain a return statement.",
  incompleteSwitch:
    "Incomplete switch, it must be exhaustive or have an default case and every case must contain a return statement.",
  unexpectedIf: "Unexpected if, use a conditional expression (ternary operator) instead.",
  unexpectedSwitch: "Unexpected switch, use a conditional expression (ternary operator) instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Statements",
    description: "Disallow conditional statements.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
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
  node: TSESTree.Node,
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  return [{ node, messageId: "incompleteBranch" }];
}

/**
 * Get a function that tests if the given statement is never returning.
 */
function getIsNeverExpressions(context: Readonly<RuleContext<keyof typeof errorMessages, Options>>) {
  return (statement: TSESTree.Statement) => {
    if (isExpressionStatement(statement)) {
      const expressionStatementType = getTypeOfNode(statement.expression, context);
      return expressionStatementType !== null && tsApiUtils?.isIntrinsicNeverType(expressionStatementType) === true;
    }
    return false;
  };
}

/**
 * Is the given statement, when inside an if statement, a returning branch?
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const branches = [node.consequent, node.alternate];
  const violations = branches.filter<NonNullable<(typeof branches)[0]>>(
    (branch): branch is NonNullable<typeof branch> => {
      if (branch === null || isIfReturningBranch(branch)) {
        return false;
      }

      if (isExpressionStatement(branch)) {
        const expressionStatementType = getTypeOfNode(branch.expression, context);

        if (expressionStatementType !== null && tsApiUtils?.isIntrinsicNeverType(expressionStatementType) === true) {
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
    },
  );

  return violations.flatMap(incompleteBranchViolation);
}

/**
 * Get all of the violations in the given switch statement assuming switch
 * statements are allowed.
 */
function getSwitchViolations(
  node: TSESTree.SwitchStatement,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  const isNeverExpressions = getIsNeverExpressions(context);

  const label = isLabeledStatement(node.parent) ? node.parent.label.name : null;

  const violations = node.cases.filter((branch) => {
    if (branch.consequent.length === 0) {
      return false;
    }
    if (branch.consequent.some(isSwitchReturningBranch)) {
      return false;
    }

    if (branch.consequent.every(isBlockStatement)) {
      const lastBlock = branch.consequent.at(-1);

      if (lastBlock.body.some(isSwitchReturningBranch)) {
        return false;
      }

      if (lastBlock.body.some(isNeverExpressions)) {
        return false;
      }
    }

    return !branch.consequent.some(isNeverExpressions);
  });

  return violations.flatMap(incompleteBranchViolation);

  /**
   * Is the given statement, when inside a switch statement, a returning branch?
   */
  function isSwitchReturningBranch(statement: TSESTree.Statement) {
    return (
      // Another instance of this rule will check nested switch statements.
      isSwitchStatement(statement) ||
      isReturnStatement(statement) ||
      isThrowStatement(statement) ||
      (isBreakStatement(statement) && statement.label !== null && statement.label.name !== label) ||
      isContinueStatement(statement)
    );
  }
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): boolean {
  const discriminantType = getTypeOfNode(node.discriminant, context);
  if (!discriminantType?.isUnion()) {
    return true;
  }

  const caseTypes = node.cases.reduce<ReadonlySet<Type>>(
    (types, c) => new Set([...types, getTypeOfNode(c.test!, context)]),
    new Set(),
  );

  return discriminantType.types.some((unionType) => !caseTypes.has(unionType));
}

/**
 * Does the given switch statement violate this rule if it must be exhaustive.
 */
function isExhaustiveSwitchViolation(
  node: TSESTree.SwitchStatement,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
): boolean {
  return (
    // No cases defined.
    node.cases.every((c) => c.test !== null) ? isExhaustiveTypeSwitchViolation(node, context) : false
  );
}

/**
 * Check if the given IfStatement violates this rule.
 */
function checkIfStatement(
  node: TSESTree.IfStatement,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ allowReturningBranches }] = options;

  return {
    context,
    descriptors:
      allowReturningBranches === false
        ? [{ node, messageId: "unexpectedIf" }]
        : allowReturningBranches === "ifExhaustive"
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
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ allowReturningBranches }] = options;

  return {
    context,
    descriptors:
      allowReturningBranches === false
        ? [{ node, messageId: "unexpectedSwitch" }]
        : allowReturningBranches === "ifExhaustive"
          ? isExhaustiveSwitchViolation(node, context)
            ? [{ node, messageId: "incompleteSwitch" }]
            : getSwitchViolations(node, context)
          : getSwitchViolations(node, context),
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    IfStatement: checkIfStatement,
    SwitchStatement: checkSwitchStatement,
  },
);
