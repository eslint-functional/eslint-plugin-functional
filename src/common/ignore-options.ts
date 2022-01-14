import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import escapeRegExp from "escape-string-regexp";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { BaseOptions } from "~/util/rule";
import {
  getKeyOfValueInObjectExpression,
  inClass,
  inFunctionBody,
  inInterface,
} from "~/util/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isDefined,
  isPropertyDefinition,
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

/**
 * The option to allow local mutations.
 */
export type AllowLocalMutationOption = {
  readonly allowLocalMutation: boolean;
};

/**
 * The schema for the option to allow local mutations.
 */
export const allowLocalMutationOptionSchema: JSONSchema4["properties"] = {
  allowLocalMutation: {
    type: "boolean",
  },
};

/**
 * The option to ignore patterns.
 */
export type IgnorePatternOption = {
  readonly ignorePattern?: ReadonlyArray<string> | string;
};

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
export type IgnoreAccessorPatternOption = {
  readonly ignoreAccessorPattern?: ReadonlyArray<string> | string;
};

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
export type IgnoreClassOption = {
  readonly ignoreClass: boolean | "fieldsOnly";
};

/**
 * The schema for the option to ignore classes.
 */
export const ignoreClassOptionSchema: JSONSchema4["properties"] = {
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
};

/**
 * The option to ignore interfaces.
 */
export type IgnoreInterfaceOption = {
  readonly ignoreInterface: boolean;
};

/**
 * The schema for the option to ignore interfaces.
 */
export const ignoreInterfaceOptionSchema: JSONSchema4["properties"] = {
  ignoreInterface: {
    type: "boolean",
  },
};

/**
 * Get the identifier text of the given node.
 */
function getNodeIdentifierText(
  node: ReadonlyDeep<TSESTree.Node> | null | undefined,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
): string | undefined {
  if (!isDefined(node)) {
    return undefined;
  }

  const identifierText = isIdentifier(node)
    ? node.name
    : hasID(node) && isDefined(node.id)
    ? getNodeIdentifierText(node.id, context)
    : hasKey(node) && isDefined(node.key)
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
    ? context.getSourceCode().getText(node as TSESTree.Node)
    : isTSArrayType(node) ||
      isTSIndexSignature(node) ||
      isTSTupleType(node) ||
      isTSTypeAnnotation(node) ||
      isTSTypeLiteral(node) ||
      isTSTypeReference(node)
    ? getNodeIdentifierText(node.parent, context)
    : null;

  if (identifierText !== null) {
    return identifierText;
  }

  const keyInObjectExpression = getKeyOfValueInObjectExpression(node);
  if (keyInObjectExpression !== null) {
    return keyInObjectExpression;
  }

  return undefined;
}

/**
 * Get all the identifier texts of the given node.
 */
function getNodeIdentifierTexts(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>
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
 * - AllowLocalMutationOption.
 */
export function shouldIgnoreLocalMutation(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>,
  { allowLocalMutation }: Partial<AllowLocalMutationOption>
): boolean {
  return allowLocalMutation === true && inFunctionBody(node);
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - IgnoreClassOption.
 */
export function shouldIgnoreClass(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>,
  { ignoreClass }: Partial<IgnoreClassOption>
): boolean {
  return (
    (ignoreClass === true && inClass(node)) ||
    (ignoreClass === "fieldsOnly" &&
      (isPropertyDefinition(node) ||
        (isAssignmentExpression(node) &&
          inClass(node) &&
          isMemberExpression(node.left) &&
          isThisExpression(node.left.object))))
  );
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - IgnoreInterfaceOption.
 */
export function shouldIgnoreInterface(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>,
  { ignoreInterface }: Partial<IgnoreInterfaceOption>
): boolean {
  return ignoreInterface === true && inInterface(node);
}

/**
 * Should the given node be allowed base off the following rule options?
 *
 * - IgnoreAccessorPatternOption.
 * - IgnorePatternOption.
 */
export function shouldIgnorePattern(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<TSESLint.RuleContext<string, BaseOptions>>,
  {
    ignorePattern,
    ignoreAccessorPattern,
  }: Partial<IgnoreAccessorPatternOption & IgnorePatternOption>
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
