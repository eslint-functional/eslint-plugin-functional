// Polyfill.
import "array.prototype.flatmap/auto.js";

import { TSESTree } from "@typescript-eslint/typescript-estree";
import escapeRegExp from "escape-string-regexp";
import { JSONSchema4 } from "json-schema";

import { BaseOptions, RuleContext } from "../util/rule";
import { inClass, inFunction, inInterface } from "../util/tree";
import {
  isAssignmentExpression,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isTSPropertySignature,
  isTSTypeAliasDeclaration,
  isVariableDeclaration,
  isVariableDeclarator
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
 * Recursive callback of `getNodeText`.
 *
 * This function not be called from anywhere else.
 */
function _getNodeText(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>
): string {
  return isIdentifier(node)
    ? node.name
    : isMemberExpression(node)
    ? `${_getNodeText(node.object, context)}.${_getNodeText(
        node.property,
        context
      )}`
    : context.getSourceCode().getText(node);
}

/**
 * Get the text of the given node.
 */
function getNodeText(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>
): string | undefined {
  return isAssignmentExpression(node)
    ? getNodeText(node.left, context)
    : isCallExpression(node)
    ? getNodeText(node.callee, context)
    : isMemberExpression(node)
    ? _getNodeText(node.object, context)
    : isVariableDeclarator(node) || isTSTypeAliasDeclaration(node)
    ? _getNodeText(node.id, context)
    : isTSPropertySignature(node)
    ? _getNodeText(node.key, context)
    : _getNodeText(node, context);
}

/**
 * Get all the important bits of texts from the given node.
 */
function getNodeTexts(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>
): ReadonlyArray<string> {
  return (isVariableDeclaration(node)
    ? node.declarations.flatMap(declarator => getNodeText(declarator, context))
    : [getNodeText(node, context)]
  ).filter(name => name !== undefined) as ReadonlyArray<string>;
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
    (Boolean(options.ignoreLocal) && inFunction(node)) ||
    // Ignore if in a class and ignoreClass is set.
    (Boolean(options.ignoreClass) && inClass(node)) ||
    // Ignore if in an interface and ignoreInterface is set.
    (Boolean(options.ignoreInterface) && inInterface(node)) ||
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
        : false)(getNodeTexts(node, context))
  );
}
