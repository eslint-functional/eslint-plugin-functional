import { TSESTree } from "@typescript-eslint/typescript-estree";
import { deepMerge } from "@typescript-eslint/experimental-utils/dist/eslint-utils";

import * as ignore from "../common/ignoreOptions";
import { createRule, RuleContext, RuleMetaData } from "../util/rule";

// The name of this rule.
export const name = "no-let" as const;

// The options this rule can take.
type Options = [ignore.IgnoreLocalOption & ignore.IgnoreOption];

// The schema for the rule options.
const schema = [
  deepMerge(ignore.ignoreLocalOptionSchema, ignore.ignoreOptionSchema)
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreLocal: false
  }
];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected let, use const instead."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow mutable variables.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  fixable: "code",
  schema
};

/**
 * Check if the given VariableDeclaration violates this rule.
 */
function checkVariableDeclaration(
  node: TSESTree.VariableDeclaration,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  if (node.kind === "let") {
    // Report the error.
    context.report({
      node,
      messageId: "generic",
      fix(fixer) {
        return fixer.replaceTextRange(
          [node.range[0], node.range[0] + node.kind.length],
          "const"
        );
      }
    });
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkVariableDeclaration = ignore.checkNodeWithIgnore(
      checkVariableDeclaration,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      VariableDeclaration: _checkVariableDeclaration
    };
  }
});
