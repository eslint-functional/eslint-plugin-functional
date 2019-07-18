import { TSESTree } from "@typescript-eslint/typescript-estree";
import { JSONSchema4 } from "json-schema";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";

// The name of this rule.
export const name = "no-throw" as const;

// The options this rule can take.
type Options = readonly [];

// The schema for the rule options.
const schema: JSONSchema4 = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected throw, throwing exceptions is not functional."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow throwing exceptions.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

/**
 * Check if the given ThrowStatement violates this rule.
 */
function checkThrowStatement(
  node: TSESTree.ThrowStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  // All throw statements violate this rule.
  return { context, descriptors: [{ node, messageId: "generic" }] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkThrowStatement = checkNode(checkThrowStatement, context);

    return {
      ThrowStatement: _checkThrowStatement
    };
  }
});
