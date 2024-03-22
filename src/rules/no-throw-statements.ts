import { type TSESTree } from "@typescript-eslint/utils";
import { type JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";
import {
  createRule,
  type NamedCreateRuleCustomMeta,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";
import { isInFunctionBody } from "#eslint-plugin-functional/utils/tree";

/**
 * The name of this rule.
 */
export const name = "no-throw-statements" as const;

/**
 * The full name of this rule.
 */
export const fullName = `${ruleNameScope}/${name}` as const;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowInAsyncFunctions: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: {
      allowInAsyncFunctions: {
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
    allowInAsyncFunctions: false,
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
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages, Options> = {
  type: "suggestion",
  docs: {
    category: "No Exceptions",
    description: "Disallow throwing exceptions.",
    recommended: "recommended",
    recommendedSeverity: "error",
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
  const [{ allowInAsyncFunctions }] = options;

  if (!allowInAsyncFunctions || !isInFunctionBody(node, true)) {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }

  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ThrowStatement: checkThrowStatement,
  },
);
