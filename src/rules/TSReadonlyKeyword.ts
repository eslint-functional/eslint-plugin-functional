import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";

import * as ignore from "../common/ignoreOptions";
import { createRule, RuleContext, RuleMetaData } from "../util/rule";
import { isTSIndexSignature } from "../util/typeguard";

// The name of this rule.
export const name = "readonly-keyword" as const;

// The options this rule can take.
type Options = [
  ignore.IgnoreLocalOption &
    ignore.IgnoreOption &
    ignore.IgnoreClassOption &
    ignore.IgnoreInterfaceOption
];

// The schema for the rule options.
const schema = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignoreOptionSchema,
    ignore.ignoreClassOptionSchema,
    ignore.ignoreInterfaceOptionSchema
  ])
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreClass: false,
    ignoreInterface: false,
    ignoreLocal: false
  }
];

// The possible error messages.
const errorMessages = {
  generic: "A readonly modifier is required."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce readonly modifiers are used where possible.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  fixable: "code",
  schema
};

/**
 * Check if the given node violates this rule.
 */
function checkNode(
  node:
    | TSESTree.TSPropertySignature
    | TSESTree.TSIndexSignature
    | TSESTree.ClassProperty,
  context: RuleContext<keyof typeof errorMessages, Options>
) {
  if (!node.readonly) {
    const fix = "readonly ";
    context.report({
      node,
      messageId: "generic",
      fix: isTSIndexSignature(node)
        ? fixer => fixer.insertTextBefore(node, fix)
        : fixer => fixer.insertTextBefore(node.key, fix)
    });
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkNode = ignore.checkNodeWithIgnore(
      checkNode,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      ClassProperty: _checkNode,
      TSIndexSignature: _checkNode,
      TSPropertySignature: _checkNode
    };
  }
});
