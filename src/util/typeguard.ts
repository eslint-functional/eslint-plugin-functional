/**
 * This file has functions that typeguard the given node/type.
 */

import { TSESTree } from "@typescript-eslint/typescript-estree";
// TS import - only use this for types, will be stripped out by rollup.
import { Type, UnionType } from "typescript";
// TS import - conditionally imported only when typescript is avaliable.
import ts from "../util/conditional-imports/typescript";

/*
 * TS Types.
 */

export type ArrayType = Type & {
  readonly symbol: {
    readonly name: "Array";
  };
};

export type ArrayConstructorType = Type & {
  readonly symbol: {
    readonly name: "ArrayConstructor";
  };
};

export type ObjectConstructorType = Type & {
  readonly symbol: {
    readonly name: "ObjectConstructor";
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

export function isUnionType(type: Type): type is UnionType {
  return ts !== undefined && type.flags === ts.TypeFlags.Union;
}

export function isArrayType(type: Type): type is ArrayType {
  return (
    (type.symbol && type.symbol.name === "Array") ||
    (isUnionType(type) && type.types.some(isArrayType))
  );
}

export function isArrayConstructorType(
  type: Type
): type is ArrayConstructorType {
  return (
    (type.symbol && type.symbol.name === "ArrayConstructor") ||
    (isUnionType(type) && type.types.some(isArrayConstructorType))
  );
}

export function isObjectConstructorType(
  type: Type
): type is ObjectConstructorType {
  return (
    (type.symbol && type.symbol.name === "ObjectConstructor") ||
    (isUnionType(type) && type.types.some(isObjectConstructorType))
  );
}
