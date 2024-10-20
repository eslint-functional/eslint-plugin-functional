import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#/utils/misc";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";
import { getEnclosingFunction, getEnclosingTryStatement, isInPromiseHandlerFunction } from "#/utils/tree";

/**
 * The name of this rule.
 */
export const name = "no-throw-statements";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowToRejectPromises: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: {
      allowToRejectPromises: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    allowToRejectPromises: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Unexpected throw, throwing exceptions is not functional.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Exceptions",
    description: "Disallow throwing exceptions.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given ThrowStatement violates this rule.
 */
function checkThrowStatement(
  node: TSESTree.ThrowStatement,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [{ allowToRejectPromises }] = options;

  if (!allowToRejectPromises) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  if (isInPromiseHandlerFunction(node, context)) {
    return { context, descriptors: [] };
  }

  const enclosingFunction = getEnclosingFunction(node);
  if (enclosingFunction?.async !== true) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  const enclosingTryStatement = getEnclosingTryStatement(node);
  if (
    !(
      enclosingTryStatement === null ||
      getEnclosingFunction(enclosingTryStatement) !== enclosingFunction ||
      enclosingTryStatement.handler === null
    )
  ) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ThrowStatement: checkThrowStatement,
  },
);
