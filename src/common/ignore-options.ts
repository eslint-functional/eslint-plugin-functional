// Polyfill.
import "array.prototype.flatmap/auto.js";

import { TSESTree } from "@typescript-eslint/typescript-estree";
import escapeRegExp from "escape-string-regexp";
import { JSONSchema4 } from "json-schema";

import { BaseOptions, RuleContext } from "../util/rule";
import { inClass, inFunction, inInterface } from "../util/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isThisExpression,
  isTSArrayType,
  isTSIndexSignature,
  isTSTupleType,
  isTSTypeAnnotation,
  isTSTypeReference,
  isUnaryExpression,
  isVariableDeclaration
} from "../util/typeguard";

type IgnoreOptions = IgnoreLocalOption &
  IgnorePatternOption &
  IgnoreAccessorPatternOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnoreNewArrayOption;

export type IgnoreLocalOption = {
  readonly ignoreLocal?: boolean;
};

export const ignoreLocalOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreLocal: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export type IgnorePatternOption = {
  readonly ignorePattern?: string | ReadonlyArray<string>;
};
export const ignorePatternOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignorePattern: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    }
  },
  additionalProperties: false
};

export type IgnoreAccessorPatternOption = {
  readonly ignoreAccessorPattern?: string | ReadonlyArray<string>;
};
export const ignoreAccessorPatternOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreAccessorPattern: {
      type: ["string", "array"],
      items: {
        type: "string"
      }
    }
  },
  additionalProperties: false
};

export type IgnoreReturnTypeOption = {
  readonly ignoreReturnType?: boolean;
};
export const ignoreReturnTypeOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreReturnType: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export type IgnoreClassOption = {
  readonly ignoreClass?: boolean;
};
export const ignoreClassOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreClass: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export type IgnoreInterfaceOption = {
  readonly ignoreInterface?: boolean;
};
export const ignoreInterfaceOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreInterface: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

export type IgnoreNewArrayOption = {
  readonly ignoreNewArray?: boolean;
};
export const ignoreNewArrayOptionSchema: JSONSchema4 = {
  type: "object",
  properties: {
    ignoreNewArray: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

/**
 * Get the identifier text of the given node.
 */
function getNodeIdentifierText(
  node: TSESTree.Node | undefined | null,
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
  return (isVariableDeclaration(node)
    ? node.declarations.flatMap(declarator =>
        getNodeIdentifierText(declarator, context)
      )
    : [getNodeIdentifierText(node, context)]
  ).filter<string>((text): text is string => text !== undefined);
}

/**
 * Should the given text be ignore?
 *
 * Test using the given pattern(s).
 */
function shouldIgnoreViaPattern(
  text: string,
  ignorePattern: ReadonlyArray<string> | string
): boolean {
  const patterns: ReadonlyArray<string> = Array.isArray(ignorePattern)
    ? ignorePattern
    : [ignorePattern];

  // One or more patterns match?
  return patterns.some(pattern => new RegExp(pattern).test(text));
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
  allowExtra: boolean = false
): boolean {
  return pattern === undefined
    ? allowExtra || textParts.length === 0
    : // Match any depth (including 0)?
    pattern === "**"
    ? textParts.length === 0
      ? accessorPatternMatch(remainingPatternParts, [], allowExtra)
      : Array.from({ length: textParts.length })
          .map((_element, index) => index)
          .some(offset =>
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
      new RegExp("^" + escapeRegExp(pattern).replace(/\\\*/g, ".*") + "$").test(
        textParts[0]
      ) &&
      accessorPatternMatch(
        remainingPatternParts,
        textParts.slice(1),
        allowExtra
      );
}

/**
 * Should the given text be ignore?
 *
 * Test using the given accessor pattern(s).
 */
function shouldIgnoreViaAccessorPattern(
  text: string,
  ignorePattern: ReadonlyArray<string> | string
): boolean {
  const patterns: ReadonlyArray<string> = Array.isArray(ignorePattern)
    ? ignorePattern
    : [ignorePattern];

  // One or more patterns match?
  return patterns.some(pattern =>
    accessorPatternMatch(pattern.split("."), text.split("."))
  );
}

/**
 * Should the given node be ignored?
 */
export function shouldIgnore(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>,
  options: Partial<IgnoreOptions>
): boolean {
  return (
    // Ignore if in a function and ignoreLocal is set.
    (options.ignoreLocal === true && inFunction(node)) ||
    // Ignore if in a class and ignoreClass is set.
    (options.ignoreClass === true && inClass(node)) ||
    // Ignore if in an interface and ignoreInterface is set.
    (options.ignoreInterface === true && inInterface(node)) ||
    ((texts: ReadonlyArray<string>): boolean =>
      texts.length > 0
        ? // Ignore if ignorePattern is set and a pattern matches.
          (options.ignorePattern !== undefined &&
            texts.every(text =>
              shouldIgnoreViaPattern(text, options.ignorePattern!)
            )) ||
          // Ignore if ignoreAccessorPattern is set and an accessor pattern matches.
          (options.ignoreAccessorPattern !== undefined &&
            texts.every(text =>
              shouldIgnoreViaAccessorPattern(
                text,
                options.ignoreAccessorPattern!
              )
            ))
        : false)(getNodeIdentifierTexts(node, context))
  );
}
