/**
 * This file has functions that typeguard the given node/type.
 */

import { TSESTree } from "@typescript-eslint/typescript-estree";

import { getForXStatement } from "./tree";
import { ForXStatement } from "./types";

export function isMemberExpression(
  node: TSESTree.Node
): node is TSESTree.MemberExpression {
  return node.type === "MemberExpression";
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === "Identifier";
}

export function isTSPropertySignature(
  node: TSESTree.Node
): node is TSESTree.TSPropertySignature {
  return node.type === "TSPropertySignature";
}

export function isClassLike(
  node: TSESTree.Node
): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression {
  return node.type === "ClassDeclaration" || node.type === "ClassExpression";
}

export function isFunctionLike(
  node: TSESTree.Node
): node is
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

export function isVariableDeclaration(
  node: TSESTree.Node
): node is TSESTree.VariableDeclaration {
  return node.type === "VariableDeclaration";
}

export function isVariableDeclarator(
  node: TSESTree.Node
): node is TSESTree.VariableDeclarator {
  return node.type === "VariableDeclarator";
}

export function isTypeAliasDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSTypeAliasDeclaration {
  return node.type === "TSTypeAliasDeclaration";
}

export function isForXInitialiser(
  node: TSESTree.Node
): node is TSESTree.ForInitialiser {
  const forX = getForXStatement(node);
  return forX !== null && forX.left === node;
}

export function isForXStatement(node: TSESTree.Node): node is ForXStatement {
  return node.type === "ForInStatement" || node.type === "ForOfStatement";
}

export function isTSIndexSignature(
  node: TSESTree.Node
): node is TSESTree.TSIndexSignature {
  return node.type === "TSIndexSignature";
}
