import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isTSIndexSignature, isTSParameterProperty } from "../util/typeguard";

// The name of this rule.
export const name = "readonly-keyword" as const;

// The options this rule can take.
type Options = readonly [
  ignore.IgnoreLocalOption &
    ignore.IgnorePatternOption &
    ignore.IgnoreClassOption &
    ignore.IgnoreInterfaceOption
];

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignorePatternOptionSchema,
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
function check(
  node:
    | TSESTree.TSPropertySignature
    | TSESTree.TSIndexSignature
    | TSESTree.ClassProperty
    | TSESTree.TSParameterProperty,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: node.readonly
      ? []
      : [
          {
            node,
            messageId: "generic",
            fix: isTSIndexSignature(node)
              ? fixer => fixer.insertTextBefore(node, "readonly ")
              : isTSParameterProperty(node)
              ? fixer => fixer.insertTextBefore(node.parameter, "readonly ")
              : fixer => fixer.insertTextBefore(node.key, "readonly ")
          }
        ]
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkNode = checkNode(check, context, ignoreOptions, otherOptions);

    return {
      ClassProperty: _checkNode,
      TSIndexSignature: _checkNode,
      TSPropertySignature: _checkNode,
      TSParameterProperty: _checkNode
    };
  }
});
