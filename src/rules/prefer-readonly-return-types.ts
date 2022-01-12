import type { ReadonlynessOptions } from "@typescript-eslint/type-utils";
import {
  readonlynessOptionsDefaults,
  readonlynessOptionsSchema,
} from "@typescript-eslint/type-utils";
import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type {
  AllowLocalMutationOption,
  IgnoreClassOption,
  IgnoreInferredTypesOption,
  IgnoreInterfaceOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignoreInferredTypesOptionSchema,
  ignoreInterfaceOptionSchema,
  ignorePatternOptionSchema,
  shouldIgnoreClass,
  shouldIgnoreInferredTypes,
  shouldIgnoreInterface,
  shouldIgnoreLocalMutation,
  shouldIgnorePattern,
} from "~/common/ignore-options";
import type { RuleResult } from "~/util/rule";
import { isReadonly, createRule } from "~/util/rule";
import { isFunctionLike, isTSFunctionType } from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "prefer-readonly-return-types" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  AllowLocalMutationOption &
    IgnoreClassOption &
    IgnoreInferredTypesOption &
    IgnoreInterfaceOption &
    IgnorePatternOption &
    ReadonlynessOptions
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(
      allowLocalMutationOptionSchema,
      ignoreClassOptionSchema,
      ignoreInferredTypesOptionSchema,
      ignoreInterfaceOptionSchema,
      ignorePatternOptionSchema,
      readonlynessOptionsSchema.properties
    ),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    ignoreClass: false,
    ignoreInterface: false,
    allowLocalMutation: false,
    ignoreInferredTypes: false,
    ...readonlynessOptionsDefaults,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  returnTypeShouldBeReadonly: "Return type should be readonly.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly return types over mutable one.",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

/**
 * Check if the given TypeAnnotation violates this rule.
 */
function checkTypeAnnotation(
  node: ReadonlyDeep<TSESTree.TSTypeAnnotation>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  [optionsObject]: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (
    !isReturnType(node) ||
    shouldIgnoreInferredTypes(node.typeAnnotation, context, optionsObject) ||
    shouldIgnoreClass(node.typeAnnotation, context, optionsObject) ||
    shouldIgnoreInterface(node.typeAnnotation, context, optionsObject) ||
    shouldIgnoreLocalMutation(node.typeAnnotation, context, optionsObject) ||
    shouldIgnorePattern(node.typeAnnotation, context, optionsObject) ||
    isReadonly(node.typeAnnotation, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: [
      {
        node: node.typeAnnotation,
        messageId: "returnTypeShouldBeReadonly",
      },
    ],
  };
}

/**
 * Is the given node a return type?
 */
function isReturnType(node: ReadonlyDeep<TSESTree.TSTypeAnnotation>) {
  return (
    node.parent !== undefined &&
    (isFunctionLike(node.parent) || isTSFunctionType(node.parent)) &&
    node.parent.returnType === node
  );
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSTypeAnnotation: checkTypeAnnotation,
  }
);
