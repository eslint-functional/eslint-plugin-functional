import { TSESTree } from "@typescript-eslint/typescript-estree";
import { deepMerge } from "@typescript-eslint/experimental-utils/dist/eslint-utils";

import * as Ignore from "../common/ignoreOptions";
import { createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isFunctionLike } from "../util/typeguard";

// The name of this rule.
export const name = "no-let" as const;

// The options this rule can take.
type Options = [Ignore.IgnoreLocalOption & Ignore.IgnoreOption];

// The schema for the rule options.
const schema = [deepMerge(Ignore.IgnoreLocalSchema, Ignore.IgnoreSchema)];

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
  context: RuleContext<Options, keyof typeof errorMessages>,
  [ignoreOptions]: Options
) {
  return (node: TSESTree.VariableDeclaration) => {
    if (node.kind === "let") {
      // Ignore local declarations?
      if (ignoreOptions.ignoreLocal) {
        // Check if in a function like body.
        let n: TSESTree.Node | undefined = node;
        while ((n = n.parent)) {
          if (isFunctionLike(n)) {
            return;
          }
        }
      }

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
  };
}

// Create the rule.
export const rule = createRule<Options, keyof typeof errorMessages>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkVariableDeclaration = checkVariableDeclaration(
      context,
      options
    );

    return {
      VariableDeclaration: _checkVariableDeclaration
    };
  }
});
