import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type BaseOptions } from "#eslint-plugin-functional/utils/rule";
import { getKeyOfValueInObjectExpression } from "#eslint-plugin-functional/utils/tree";
import {
  hasID,
  hasKey,
  isAssignmentExpression,
  isDefined,
  isIdentifier,
  isMemberExpression,
  isPrivateIdentifier,
  isThisExpression,
  isTSTypeAnnotation,
  isUnaryExpression,
  isVariableDeclaration,
} from "#eslint-plugin-functional/utils/type-guards";

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
export function isDirectivePrologue(
  node: TSESTree.ExpressionStatement,
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
  context: Readonly<RuleContext<string, BaseOptions>>,
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
                  context,
                )}`
              : isThisExpression(node)
                ? "this"
                : isUnaryExpression(node)
                  ? getNodeIdentifierText(node.argument, context)
                  : isTSTypeAnnotation(node)
                    ? context.sourceCode
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
 * Get the code of the given node.
 */
export function getNodeCode(
  node: TSESTree.Node,
  context: Readonly<RuleContext<string, BaseOptions>>,
): string {
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
      ? node.declarations.flatMap((declarator) =>
          getNodeIdentifierText(declarator, context),
        )
      : [getNodeIdentifierText(node, context)]
  ).filter<string>((text): text is string => text !== undefined);
}
