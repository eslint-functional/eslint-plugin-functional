/**
 * This file has functions that typeguard the given node/type.
 */

import { TSESTree } from "@typescript-eslint/typescript-estree";

export function isMemberExpression(
  node: TSESTree.Node
): node is TSESTree.MemberExpression {
  return node.type === "MemberExpression";
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === "Identifier";
}
