import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { BaseOptions } from "~/utils/rule";
import { getKeyOfValueInObjectExpression } from "~/utils/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isDefined,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isPrivateIdentifier,
  isThisExpression,
  isTSTypeAnnotation,
  isUnaryExpression,
  isVariableDeclaration,
} from "~/utils/type-guards";

/**
 * Higher order function to check if the two given values are the same.
 */
export function isExpected<T>(expected: T): (actual: T) => boolean {
  return (actual) => actual === expected;
}

/**
 * Does the given ExpressionStatement specify directive prologues.
 */
export function isDirectivePrologue(
  node: TSESTree.ExpressionStatement
): boolean {
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
  context: TSESLint.RuleContext<string, BaseOptions>
): string | undefined {
  if (!isDefined(node)) {
    return undefined;
  }

  const identifierText =
    isIdentifier(node) || isPrivateIdentifier(node)
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
      : isTSTypeAnnotation(node)
      ? context
          .getSourceCode()
          .getText(node.typeAnnotation as TSESTree.Node)
          .replaceAll(/\s+/gmu, "")
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
export function getNodeIdentifierTexts(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<string, BaseOptions>
): string[] {
  return (
    isVariableDeclaration(node)
      ? node.declarations.flatMap((declarator) =>
          getNodeIdentifierText(declarator, context)
        )
      : [getNodeIdentifierText(node, context)]
  ).filter<string>((text): text is string => text !== undefined);
}
