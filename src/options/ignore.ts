import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import escapeRegExp from "escape-string-regexp";
import type { JSONSchema4 } from "json-schema";

import { getNodeIdentifierTexts } from "~/utils/misc";
import type { BaseOptions } from "~/utils/rule";
import { isInClass, isInFunctionBody } from "~/utils/tree";
import {
  isAssignmentExpression,
  isClassLike,
  isPropertyDefinition,
  isMemberExpression,
  isThisExpression,
} from "~/utils/type-guards";

/**
 * The option to ignore patterns.
 */
export type IgnorePatternOption = Readonly<{
  ignorePattern?: string[] | string;
}>;

/**
 * The schema for the option to ignore patterns.
 */
export const ignorePatternOptionSchema: JSONSchema4["properties"] = {
  ignorePattern: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
};

/**
 * The option to ignore accessor patterns.
 */
export type IgnoreAccessorPatternOption = Readonly<{
  ignoreAccessorPattern?: string[] | string;
}>;

/**
 * The schema for the option to ignore accessor patterns.
 */
export const ignoreAccessorPatternOptionSchema: JSONSchema4["properties"] = {
  ignoreAccessorPattern: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
};

/**
 * The option to ignore classes.
 */
export type IgnoreClassesOption = Readonly<{
  ignoreClasses: boolean | "fieldsOnly";
}>;

/**
 * The schema for the option to ignore classes.
 */
export const ignoreClassesOptionSchema: JSONSchema4["properties"] = {
  ignoreClasses: {
    oneOf: [
      {
        type: "boolean",
      },
      {
        type: "string",
        enum: ["fieldsOnly"],
      },
    ],
  },
};

/**
 * The option to ignore prefix selector.
 */
export type IgnorePrefixSelectorOption = Readonly<{
  ignorePrefixSelector?: string[] | string;
}>;

/**
 * The schema for the option to ignore prefix selector.
 */
export const ignorePrefixSelectorOptionSchema: JSONSchema4["properties"] = {
  ignorePrefixSelector: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
};

/**
 * Should the given text be allowed?
 *
 * Test using the given pattern(s).
 */
function shouldIgnoreViaPattern(
  text: string,
  ignorePattern: string[] | string
): boolean {
  const patterns = Array.isArray(ignorePattern)
    ? ignorePattern
    : [ignorePattern];

  // One or more patterns match?
  return patterns.some((pattern) => new RegExp(pattern, "u").test(text));
}

/**
 * Recursive callback of `shouldIgnoreViaAccessorPattern`.
 *
 * This function not be called from anywhere else.
 *
 * Does the given text match the given pattern.
 */
function accessorPatternMatch(
  [pattern, ...remainingPatternParts]: string[],
  textParts: string[],
  allowExtra = false
): boolean {
  return pattern === undefined
    ? allowExtra || textParts.length === 0
    : // Match any depth (including 0)?
    pattern === "**"
    ? textParts.length === 0
      ? accessorPatternMatch(remainingPatternParts, [], allowExtra)
      : Array.from({ length: textParts.length })
          .map((_element, index) => index)
          .some((offset) =>
            accessorPatternMatch(
              remainingPatternParts,
              textParts.slice(offset),
              true
            )
          )
    : // Match anything?
    pattern === "*"
    ? textParts.length > 0 &&
      accessorPatternMatch(
        remainingPatternParts,
        textParts.slice(1),
        allowExtra
      )
    : // Text matches pattern?
      new RegExp(
        `^${escapeRegExp(pattern).replaceAll("\\*", ".*")}$`,
        "u"
      ).test(textParts[0]!) &&
      accessorPatternMatch(
        remainingPatternParts,
        textParts.slice(1),
        allowExtra
      );
}

/**
 * Should the given text be allowed?
 *
 * Test using the given accessor pattern(s).
 */
function shouldIgnoreViaAccessorPattern(
  text: string,
  ignorePattern: string[] | string
): boolean {
  const patterns = Array.isArray(ignorePattern)
    ? ignorePattern
    : [ignorePattern];

  // One or more patterns match?
  return patterns.some((pattern) =>
    accessorPatternMatch(pattern.split("."), text.split("."))
  );
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - AllowInFunctionOption.
 */
export function shouldIgnoreInFunction(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<string, BaseOptions>,
  allowInFunction: boolean | undefined
): boolean {
  return allowInFunction === true && isInFunctionBody(node);
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - IgnoreClassesOption.
 */
export function shouldIgnoreClasses(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<string, BaseOptions>,
  ignoreClasses: Partial<IgnoreClassesOption>["ignoreClasses"]
): boolean {
  return (
    (ignoreClasses === true && (isClassLike(node) || isInClass(node))) ||
    (ignoreClasses === "fieldsOnly" &&
      (isPropertyDefinition(node) ||
        (isAssignmentExpression(node) &&
          isInClass(node) &&
          isMemberExpression(node.left) &&
          isThisExpression(node.left.object))))
  );
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - IgnoreAccessorPatternOption.
 * - IgnorePatternOption.
 */
export function shouldIgnorePattern(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<string, BaseOptions>,
  ignorePattern: Partial<IgnorePatternOption>["ignorePattern"],
  ignoreAccessorPattern?: Partial<IgnoreAccessorPatternOption>["ignoreAccessorPattern"]
): boolean {
  const texts = getNodeIdentifierTexts(node, context);

  if (texts.length === 0) {
    return false;
  }

  return (
    // Ignore if ignorePattern is set and a pattern matches.
    (ignorePattern !== undefined &&
      texts.every((text) => shouldIgnoreViaPattern(text, ignorePattern))) ||
    // Ignore if ignoreAccessorPattern is set and an accessor pattern matches.
    (ignoreAccessorPattern !== undefined &&
      texts.every((text) =>
        shouldIgnoreViaAccessorPattern(text, ignoreAccessorPattern)
      ))
  );
}
