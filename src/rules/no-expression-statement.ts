import { TSESTree } from "@typescript-eslint/typescript-estree";

import * as ignore from "../common/ignoreOptions";
import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-expression-statement" as const;

// The options this rule can take.
type Options = [ignore.IgnorePatternOptions];

// The schema for the rule options.
const schema = [ignore.ignorePatternOptionsSchema];

// The default options for the rule.
const defaultOptions: Options = [{}];

// The possible error messages.
const errorMessages = {
  generic: "Using expressions to cause side-effects not allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow expression statements.",
    category: "Best Practices",
    recommended: false
  },
  messages: errorMessages,
  schema
};

/**
 * Check if the given ExpressionStatement violates this rule.
 */
function checkExpressionStatement(
  node: TSESTree.ExpressionStatement,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  // All expression statements violate this rule.
  context.report({ node, messageId: "generic" });
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkExpressionStatement = checkNode(
      checkExpressionStatement,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      ExpressionStatement: _checkExpressionStatement
    };
  }
});
