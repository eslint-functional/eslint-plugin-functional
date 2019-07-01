import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";

import * as ignore from "../common/ignoreOptions";
import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isForXInitialiser } from "../util/typeguard";

// The name of this rule.
export const name = "no-let" as const;

// The options this rule can take.
type Options = [ignore.IgnoreLocalOption & ignore.IgnorePatternOptions];

// The schema for the rule options.
const schema = [
  deepMerge([ignore.ignoreLocalOptionSchema, ignore.ignorePatternOptionsSchema])
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
      fix:
        // Can only fix if all declarations have an initial value (with the
        // exception of ForOf and ForIn Statement initialisers).
        node.declarations.every(declaration => declaration.init !== null) ||
        isForXInitialiser(node)
          ? fixer =>
              fixer.replaceTextRange(
                [node.range[0], node.range[0] + node.kind.length],
                "const"
              )
          : undefined
    });
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkVariableDeclaration = checkNode(
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
