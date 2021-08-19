import type { TSESTree } from "@typescript-eslint/experimental-utils";
import escapeRegExp from "escape-string-regexp";
import type { JSONSchema4 } from "json-schema";

import type { BaseOptions, RuleContext } from "~/util/rule";
import { inClass, inFunctionBody, inInterface } from "~/util/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isClassProperty,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isReadonlyArray,
  isThisExpression,
  isTSArrayType,
  isTSIndexSignature,
  isTSTupleType,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeReference,
  isUnaryExpression,
  isVariableDeclaration,
} from "~/util/typeguard";

export type AllowLocalMutationOption = {
  readonly allowLocalMutation: boolean;
};

export const allowLocalMutationOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    allowLocalMutation: {
      type: "boolean",
    },
  },
  additionalProperties: false,
};

export type IgnorePatternOption = {
  readonly ignorePattern?: ReadonlyArray<string> | string;
};

export const ignorePatternOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignorePattern: {
      type: ["string", "array"],
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: false,
};

export type IgnoreAccessorPatternOption = {
  readonly ignoreAccessorPattern?: ReadonlyArray<string> | string;
};

export const ignoreAccessorPatternOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreAccessorPattern: {
      type: ["string", "array"],
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: false,
};

export type IgnoreClassOption = {
  readonly ignoreClass: boolean | "fieldsOnly";
};

export const ignoreClassOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreClass: {
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
  },
  additionalProperties: false,
};

export type IgnoreInterfaceOption = {
  readonly ignoreInterface: boolean;
};

export const ignoreInterfaceOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreInterface: {
      type: "boolean",
    },
  },
  additionalProperties: false,
};

/**
 * Get the identifier text of the given node.
 */
function getNodeIdentifierText(
  node: TSESTree.Node | null | undefined,
  context: RuleContext<string, BaseOptions>
): string | undefined {
  return node === undefined || node === null
    ? undefined
    : isIdentifier(node)
    ? node.name
    : hasID(node)
    ? getNodeIdentifierText(node.id, context)
    : hasKey(node)
    ? getNodeIdentifierText(node.key, context)
    : isAssignmentExpression(node)
    ? getNodeIdentifierText(node.left, context)
    : isMemberExpression(node)
    ? `${getNodeIdentifierText(node.object, context)}.${getNodeIdentifierText(
        node.property,
        context
      )}`
    : isThisExpression(node)
    ? "this"
    : isUnaryExpression(node)
    ? getNodeIdentifierText(node.argument, context)
    : isExpressionStatement(node)
    ? context.getSourceCode().getText(node)
    : isTSArrayType(node) ||
      isTSIndexSignature(node) ||
      isTSTupleType(node) ||
      isTSTypeAnnotation(node) ||
      isTSTypeLiteral(node) ||
      isTSTypeReference(node)
    ? getNodeIdentifierText(node.parent, context)
    : undefined;
}

/**
 * Get all the identifier texts of the given node.
 */
function getNodeIdentifierTexts(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>
): ReadonlyArray<string> {
  return (
    isVariableDeclaration(node)
      ? node.declarations.flatMap((declarator) =>
          getNodeIdentifierText(declarator, context)
        )
      : [getNodeIdentifierText(node, context)]
  ).filter<string>((text): text is string => text !== undefined);
}

/**
 * Should the given text be allowed?
 *
 * Test using the given pattern(s).
 */
function shouldIgnoreViaPattern(
  text: string,
  ignorePattern: ReadonlyArray<string> | string
): boolean {
  const patterns: ReadonlyArray<string> = isReadonlyArray(ignorePattern)
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
  [pattern, ...remainingPatternParts]: ReadonlyArray<string>,
  textParts: ReadonlyArray<string>,
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
        `^${escapeRegExp(pattern).replace(/\\\*/gu, ".*")}$`,
        "u"
      ).test(textParts[0]) &&
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
  ignorePattern: ReadonlyArray<string> | string
): boolean {
  const patterns: ReadonlyArray<string> = isReadonlyArray(ignorePattern)
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
 * - IgnoreAccessorPatternOption.
 * - IgnoreClassOption.
 * - IgnoreInterfaceOption.
 * - IgnorePatternOption.
 * - AllowLocalMutationOption.
 */
export function shouldIgnore(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>,
  options: Partial<
    AllowLocalMutationOption &
      IgnoreAccessorPatternOption &
      IgnoreClassOption &
      IgnoreInterfaceOption &
      IgnorePatternOption
  >
): boolean {
  return (
    // Allow if in a function and allowLocalMutation is set.
    (options.allowLocalMutation === true && inFunctionBody(node)) ||
    // Ignore if in a class and ignoreClass is set.
    (options.ignoreClass === true && inClass(node)) ||
    // Ignore if class field and ignoreClass is set for ignoring fields.
    (options.ignoreClass === "fieldsOnly" &&
      (isClassProperty(node) ||
        (isAssignmentExpression(node) &&
          inClass(node) &&
          isMemberExpression(node.left) &&
          isThisExpression(node.left.object)))) ||
    // Ignore if in an interface and ignoreInterface is set.
    (options.ignoreInterface === true && inInterface(node)) ||
    ((texts: ReadonlyArray<string>): boolean =>
      texts.length > 0
        ? // Ignore if ignorePattern is set and a pattern matches.
          (options.ignorePattern !== undefined &&
            texts.every((text) =>
              shouldIgnoreViaPattern(text, options.ignorePattern!)
            )) ||
          // Ignore if ignoreAccessorPattern is set and an accessor pattern matches.
          (options.ignoreAccessorPattern !== undefined &&
            texts.every((text) =>
              shouldIgnoreViaAccessorPattern(
                text,
                options.ignoreAccessorPattern!
              )
            ))
        : false)(getNodeIdentifierTexts(node, context))
  );
}
