import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import escapeRegExp from "escape-string-regexp";

import { getNodeCode, getNodeIdentifierTexts } from "#/utils/misc";
import type { BaseOptions } from "#/utils/rule";
import { isInClass, isInFunctionBody } from "#/utils/tree";
import {
  isAssignmentExpression,
  isClassLike,
  isMemberExpression,
  isPropertyDefinition,
  isThisExpression,
} from "#/utils/type-guards";

/**
 * The option to ignore patterns.
 */
export type IgnoreIdentifierPatternOption = Readonly<{
  ignoreIdentifierPattern?: ReadonlyArray<string> | string;
}>;

/**
 * The schema for the option to ignore patterns.
 */
export const ignoreIdentifierPatternOptionSchema: JSONSchema4ObjectSchema["properties"] = {
  ignoreIdentifierPattern: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
};

/**
 * The option to ignore patterns.
 */
export type IgnoreCodePatternOption = Readonly<{
  ignoreCodePattern?: ReadonlyArray<string> | string;
}>;

/**
 * The schema for the option to ignore patterns.
 */
export const ignoreCodePatternOptionSchema: JSONSchema4ObjectSchema["properties"] = {
  ignoreCodePattern: {
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
  ignoreAccessorPattern?: ReadonlyArray<string> | string;
}>;

/**
 * The schema for the option to ignore accessor patterns.
 */
export const ignoreAccessorPatternOptionSchema: JSONSchema4ObjectSchema["properties"] = {
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
export const ignoreClassesOptionSchema: JSONSchema4ObjectSchema["properties"] = {
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
  ignorePrefixSelector?: ReadonlyArray<string> | string;
}>;

/**
 * The schema for the option to ignore prefix selector.
 */
export const ignorePrefixSelectorOptionSchema: JSONSchema4ObjectSchema["properties"] = {
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
function shouldIgnoreViaPattern(text: string, pattern: ReadonlyArray<string> | string): boolean {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];

  // One or more patterns match?
  return patterns.some((p) => new RegExp(p, "u").test(text));
}

/**
 * Recursive callback of `shouldIgnoreViaAccessorPattern`.
 *
 * This function not be called from anywhere else.
 *
 * Does the given text match the given pattern.
 */
function accessorPatternMatch(
  [pattern, ...remainingPatternParts]: ReadonlyArray<string>,
  textParts: ReadonlyArray<string>,
  allowExtra = false,
): boolean {
  return pattern === undefined
    ? allowExtra || textParts.length === 0
    : // Match any depth (including 0)?
      pattern === "**"
      ? textParts.length === 0
        ? accessorPatternMatch(remainingPatternParts, [], allowExtra)
        : Array.from({ length: textParts.length })
            .map((element, index) => index)
            .some((offset) => accessorPatternMatch(remainingPatternParts, textParts.slice(offset), true))
      : // Match anything?
        pattern === "*"
        ? textParts.length > 0 && accessorPatternMatch(remainingPatternParts, textParts.slice(1), allowExtra)
        : // Text matches pattern?
          new RegExp(`^${escapeRegExp(pattern).replaceAll("\\*", ".*")}$`, "u").test(textParts[0]!) &&
          accessorPatternMatch(remainingPatternParts, textParts.slice(1), allowExtra);
}

/**
 * Should the given text be allowed?
 *
 * Test using the given accessor pattern(s).
 */
function shouldIgnoreViaAccessorPattern(text: string, pattern: ReadonlyArray<string> | string): boolean {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];

  // One or more patterns match?
  return patterns.some((p) => accessorPatternMatch(p.split("."), text.split(".")));
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - AllowInFunctionOption.
 */
export function shouldIgnoreInFunction(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, BaseOptions>>,
  allowInFunction: boolean | undefined,
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
  context: Readonly<RuleContext<string, BaseOptions>>,
  ignoreClasses: Readonly<Partial<IgnoreClassesOption>["ignoreClasses"]>,
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
 * - IgnoreIdentifierPatternOption.
 */
export function shouldIgnorePattern(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, BaseOptions>>,
  ignoreIdentifierPattern: Readonly<Partial<IgnoreIdentifierPatternOption>["ignoreIdentifierPattern"]>,
  ignoreAccessorPattern?: Readonly<Partial<IgnoreAccessorPatternOption>["ignoreAccessorPattern"]>,
  ignoreCodePattern?: Readonly<Partial<IgnoreCodePatternOption>["ignoreCodePattern"]>,
): boolean {
  const texts = getNodeIdentifierTexts(node, context);

  if (texts.length === 0) {
    return ignoreCodePattern !== undefined && shouldIgnoreViaPattern(getNodeCode(node, context), ignoreCodePattern);
  }

  return (
    // Ignore if ignoreIdentifierPattern is set and a pattern matches.
    (ignoreIdentifierPattern !== undefined &&
      texts.every((text) => shouldIgnoreViaPattern(text, ignoreIdentifierPattern))) ||
    // Ignore if ignoreAccessorPattern is set and an accessor pattern matches.
    (ignoreAccessorPattern !== undefined &&
      texts.every((text) => shouldIgnoreViaAccessorPattern(text, ignoreAccessorPattern))) ||
    // Ignore if ignoreCodePattern is set and a code pattern matches.
    (ignoreCodePattern !== undefined && shouldIgnoreViaPattern(getNodeCode(node, context), ignoreCodePattern))
  );
}
