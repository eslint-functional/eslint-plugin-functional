import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignoreOptions";
import { checkNode, createRule, RuleContext, RuleMetaData } from "../util/rule";
import {
  isIdentifier,
  isTSArrayType,
  isTSTypeOperator,
  isFunctionLike
} from "../util/typeguard";

// The name of this rule.
export const name = "readonly-array" as const;

// The options this rule can take.
type Options = [
  ignore.IgnoreLocalOption &
    ignore.IgnorePatternOptions &
    ignore.IgnoreReturnTypeOption
];

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignorePatternOptionsSchema,
    ignore.ignoreReturnTypeOptionSchema
  ])
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreLocal: false,
    ignoreReturnType: false
  }
];

// The possible error messages.
const errorMessages = {
  generic: "Only ReadonlyArray allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly array over mutable arrays.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  fixable: "code",
  schema
};

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): void {
  if (
    !node.parent ||
    !isTSTypeOperator(node.parent) ||
    node.parent.operator !== "readonly"
  ) {
    if (options.ignoreReturnType && isInReturnType(node)) {
      return;
    }

    context.report({
      node,
      messageId: "generic",
      fix: fixer =>
        node.parent && isTSArrayType(node.parent)
          ? [
              fixer.insertTextBefore(node, "(readonly "),
              fixer.insertTextAfter(node, ")")
            ]
          : fixer.insertTextBefore(node, "readonly ")
    });
  }
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkTypeReference(
  node: TSESTree.TSTypeReference,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): void {
  if (isIdentifier(node.typeName) && node.typeName.name === "Array") {
    if (options.ignoreReturnType && isInReturnType(node)) {
      return;
    }

    context.report({
      node,
      messageId: "generic",
      fix: fixer => fixer.insertTextBefore(node, "Readonly")
    });
  }
}

/**
 * Is the given node in the return type.
 */
function isInReturnType(node: TSESTree.Node): boolean {
  let n: TSESTree.Node | undefined = node;
  while (n && n.parent) {
    if (isFunctionLike(n.parent)) {
      if (n.parent.returnType === n) {
        return true;
      }
      return false;
    }
    n = n.parent;
  }
  return false;
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, options) {
    const _checkArrayOrTupleType = checkNode(
      checkArrayOrTupleType,
      context,
      undefined,
      options
    );
    const _checkTypeReference = checkNode(
      checkTypeReference,
      context,
      undefined,
      options
    );

    return {
      TSArrayType: _checkArrayOrTupleType,
      TSTupleType: _checkArrayOrTupleType,
      TSTypeReference: _checkTypeReference
    };
  }
});
