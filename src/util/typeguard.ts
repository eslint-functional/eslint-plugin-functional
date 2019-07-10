/**
 * This file has functions that typeguard the given node/type.
 */

import { TSESTree } from "@typescript-eslint/typescript-estree";
import ts from "typescript";

import { getForXStatement } from "./tree";
import { ForXStatement } from "./types";

/*
 * TS Types.
 */

export type ArrayType = ts.Type & {
  symbol: {
    name: "Array";
  };
};

export type ArrayConstructorType = ts.Type & {
  symbol: {
    name: "ArrayConstructor";
  };
};

export type ObjectConstructorType = ts.Type & {
  symbol: {
    name: "ObjectConstructor";
  };
};

/*
 * Node type guards.
 */

export function isAssignmentExpression(
  node: TSESTree.Node
): node is TSESTree.AssignmentExpression {
  return node.type === "AssignmentExpression";
}

export function isAssignmentPattern(
  node: TSESTree.Node
): node is TSESTree.AssignmentPattern {
  return node.type === "AssignmentPattern";
}

export function isArrayExpression(
  node: TSESTree.Node
): node is TSESTree.ArrayExpression {
  return node.type === "ArrayExpression";
}

export function isCallExpression(
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  return node.type === "CallExpression";
}

export function isClassLike(
  node: TSESTree.Node
): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression {
  return node.type === "ClassDeclaration" || node.type === "ClassExpression";
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

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === "Identifier";
}

export function isMemberExpression(
  node: TSESTree.Node
): node is TSESTree.MemberExpression {
  return node.type === "MemberExpression";
}

export function isMethodDefinition(
  node: TSESTree.Node
): node is TSESTree.MethodDefinition {
  return node.type === "MethodDefinition";
}

export function isNewExpression(
  node: TSESTree.Node
): node is TSESTree.NewExpression {
  return node.type === "NewExpression";
}

export function isTSIndexSignature(
  node: TSESTree.Node
): node is TSESTree.TSIndexSignature {
  return node.type === "TSIndexSignature";
}

export function isTSInterfaceBody(
  node: TSESTree.Node
): node is TSESTree.TSInterfaceBody {
  return node.type === "TSInterfaceBody";
}

export function isTSArrayType(
  node: TSESTree.Node
): node is TSESTree.TSArrayType {
  return node.type === "TSArrayType";
}

export function isTSPropertySignature(
  node: TSESTree.Node
): node is TSESTree.TSPropertySignature {
  return node.type === "TSPropertySignature";
}

export function isTSTypeOperator(
  node: TSESTree.Node
): node is TSESTree.TSTypeOperator {
  return node.type === "TSTypeOperator";
}

export function isTypeAliasDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSTypeAliasDeclaration {
  return node.type === "TSTypeAliasDeclaration";
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

/*
 * TS types type guards.
 */

export function isUnionType(type: ts.Type): type is ts.UnionType {
  return type.flags === ts.TypeFlags.Union;
}

export function isArrayType(type: ts.Type): type is ArrayType {
  if (type.symbol && type.symbol.name === "Array") {
    return true;
  }
  if (isUnionType(type)) {
    return type.types.some(isArrayType);
  }
  return false;
}

export function isArrayConstructorType(
  type: ts.Type
): type is ArrayConstructorType {
  if (type.symbol && type.symbol.name === "ArrayConstructor") {
    return true;
  }
  if (isUnionType(type)) {
    return type.types.some(isArrayConstructorType);
  }
  return false;
}

export function isObjectConstructorType(
  type: ts.Type
): type is ObjectConstructorType {
  if (type.symbol && type.symbol.name === "ObjectConstructor") {
    return true;
  }
  if (isUnionType(type)) {
    return type.types.some(isObjectConstructorType);
  }
  return false;
}
