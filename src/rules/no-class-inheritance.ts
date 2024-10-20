import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  type IgnoreCodePatternOption,
  type IgnoreIdentifierPatternOption,
  ignoreCodePatternOptionSchema,
  ignoreIdentifierPatternOptionSchema,
  shouldIgnorePattern,
} from "#/options";
import { ruleNameScope } from "#/utils/misc";
import type { ESClass } from "#/utils/node-types";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRule } from "#/utils/rule";

/**
 * The name of this rule.
 */
export const name = "no-class-inheritance";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The options this rule can take.
 */
type Options = [IgnoreIdentifierPatternOption & IgnoreCodePatternOption];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(ignoreIdentifierPatternOptionSchema, ignoreCodePatternOptionSchema),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [{}];

/**
 * The possible error messages.
 */
const errorMessages = {
  abstract: "Unexpected abstract class.",
  extends: "Unexpected inheritance, use composition instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Other Paradigms",
    description: "Disallow inheritance in classes.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: false,
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given class node violates this rule.
 */
function checkClass(
  node: ESClass,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreIdentifierPattern, ignoreCodePattern } = optionsObject;

  const mut_descriptors: Array<RuleResult<keyof typeof errorMessages, Options>["descriptors"][number]> = [];

  if (!shouldIgnorePattern(node, context, ignoreIdentifierPattern, undefined, ignoreCodePattern)) {
    if (node.abstract) {
      const nodeText = context.sourceCode.getText(node);
      const abstractRelativeIndex = nodeText.indexOf("abstract");
      const abstractIndex = context.sourceCode.getIndexFromLoc(node.loc.start) + abstractRelativeIndex;
      const start = context.sourceCode.getLocFromIndex(abstractIndex);
      const end = context.sourceCode.getLocFromIndex(abstractIndex + "abstract".length);

      mut_descriptors.push({
        node,
        loc: {
          start,
          end,
        },
        messageId: "abstract",
      });
    }

    if (node.superClass !== null) {
      const nodeText = context.sourceCode.getText(node);
      const extendsRelativeIndex = nodeText.indexOf("extends");
      const extendsIndex = context.sourceCode.getIndexFromLoc(node.loc.start) + extendsRelativeIndex;
      const start = context.sourceCode.getLocFromIndex(extendsIndex);
      const { end } = node.superClass.loc;

      mut_descriptors.push({
        node,
        loc: {
          start,
          end,
        },
        messageId: "extends",
      });
    }
  }

  return {
    context,
    descriptors: mut_descriptors,
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ClassDeclaration: checkClass,
    ClassExpression: checkClass,
  },
);
