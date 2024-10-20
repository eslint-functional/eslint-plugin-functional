import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import type { BaseOptions } from "#/utils/rule";
import { getKeyOfValueInObjectExpression } from "#/utils/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isChainExpression,
  isDefined,
  isIdentifier,
  isMemberExpression,
  isPrivateIdentifier,
  isTSAsExpression,
  isTSNonNullExpression,
  isTSTypeAnnotation,
  isThisExpression,
  isUnaryExpression,
  isVariableDeclaration,
} from "#/utils/type-guards";

export const ruleNameScope = "functional";

/**
 * Higher order function to check if the two given values are the same.
 */
export function isExpected<T>(expected: T): (actual: T) => boolean {
  return (actual) => actual === expected;
}

/**
 * Does the given ExpressionStatement specify directive prologues.
 */
export function isDirectivePrologue(node: TSESTree.ExpressionStatement): boolean {
  return (
    node.expression.type === AST_NODE_TYPES.Literal &&
    typeof node.expression.value === "string" &&
    node.expression.value.startsWith("use ")
  );
}

/**
 * Get the identifier text of the given node.
 */
function getNodeIdentifierText(
  node: TSESTree.Node | null | undefined,
  context: Readonly<RuleContext<string, BaseOptions>>,
): string | undefined {
  if (!isDefined(node)) {
    return undefined;
  }

  let mut_identifierText: string | undefined | null = null;

  if (isIdentifier(node) || isPrivateIdentifier(node)) {
    mut_identifierText = node.name;
  } else if (hasID(node) && isDefined(node.id)) {
    mut_identifierText = getNodeIdentifierText(node.id, context);
  } else if (hasKey(node) && isDefined(node.key)) {
    mut_identifierText = getNodeIdentifierText(node.key, context);
  } else if (isAssignmentExpression(node)) {
    mut_identifierText = getNodeIdentifierText(node.left, context);
  } else if (isMemberExpression(node)) {
    mut_identifierText = `${getNodeIdentifierText(node.object, context)}.${getNodeIdentifierText(
      node.property,
      context,
    )}`;
  } else if (isThisExpression(node)) {
    mut_identifierText = "this";
  } else if (isUnaryExpression(node)) {
    mut_identifierText = getNodeIdentifierText(node.argument, context);
  } else if (isTSTypeAnnotation(node)) {
    mut_identifierText = context.sourceCode.getText(node.typeAnnotation as TSESTree.Node).replaceAll(/\s+/gu, "");
  } else if (isTSAsExpression(node) || isTSNonNullExpression(node) || isChainExpression(node)) {
    mut_identifierText = getNodeIdentifierText(node.expression, context);
  }

  if (mut_identifierText !== null) {
    return mut_identifierText;
  }

  const keyInObjectExpression = getKeyOfValueInObjectExpression(node);
  if (keyInObjectExpression !== null) {
    return keyInObjectExpression;
  }

  return undefined;
}

/**
 * Get the code of the given node.
 */
export function getNodeCode(node: TSESTree.Node, context: Readonly<RuleContext<string, BaseOptions>>): string {
  return context.sourceCode.getText(node);
}

/**
 * Get all the identifier texts of the given node.
 */
export function getNodeIdentifierTexts(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, BaseOptions>>,
): string[] {
  return (
    isVariableDeclaration(node)
      ? node.declarations.flatMap((declarator) => getNodeIdentifierText(declarator, context))
      : [getNodeIdentifierText(node, context)]
  ).filter<string>((text): text is string => text !== undefined);
}
