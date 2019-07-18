/**
 * This file has functions that typeguard the given node/type.
 */

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/typescript-estree";
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

export function isArrayExpression(
  node: TSESTree.Node
): node is TSESTree.ArrayExpression {
  return node.type === AST_NODE_TYPES.ArrayExpression;
}

export function isAssignmentExpression(
  node: TSESTree.Node
): node is TSESTree.AssignmentExpression {
  return node.type === AST_NODE_TYPES.AssignmentExpression;
}

export function isAssignmentPattern(
  node: TSESTree.Node
): node is TSESTree.AssignmentPattern {
  return node.type === AST_NODE_TYPES.AssignmentPattern;
}

export function isBlockStatement(
  node: TSESTree.Node
): node is TSESTree.BlockStatement {
  return node.type === AST_NODE_TYPES.BlockStatement;
}

export function isCallExpression(
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  return node.type === AST_NODE_TYPES.CallExpression;
}

export function isClassLike(
  node: TSESTree.Node
): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression {
  return (
    node.type === AST_NODE_TYPES.ClassDeclaration ||
    node.type === AST_NODE_TYPES.ClassExpression
  );
}

export function isFunctionLike(
  node: TSESTree.Node
): node is
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression {
  return (
    node.type === AST_NODE_TYPES.FunctionDeclaration ||
    node.type === AST_NODE_TYPES.FunctionExpression ||
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
  );
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier;
}

export function isIfStatement(
  node: TSESTree.Node
): node is TSESTree.IfStatement {
  return node.type === AST_NODE_TYPES.IfStatement;
}

export function isMemberExpression(
  node: TSESTree.Node
): node is TSESTree.MemberExpression {
  return node.type === AST_NODE_TYPES.MemberExpression;
}

export function isMethodDefinition(
  node: TSESTree.Node
): node is TSESTree.MethodDefinition {
  return node.type === AST_NODE_TYPES.MethodDefinition;
}

export function isNewExpression(
  node: TSESTree.Node
): node is TSESTree.NewExpression {
  return node.type === AST_NODE_TYPES.NewExpression;
}

export function isProperty(node: TSESTree.Node): node is TSESTree.Property {
  return node.type === AST_NODE_TYPES.Property;
}

export function isRestElement(
  node: TSESTree.Node
): node is TSESTree.RestElement {
  return node.type === AST_NODE_TYPES.RestElement;
}

export function isReturnStatement(
  node: TSESTree.Node
): node is TSESTree.ReturnStatement {
  return node.type === AST_NODE_TYPES.ReturnStatement;
}

export function isTSArrayType(
  node: TSESTree.Node
): node is TSESTree.TSArrayType {
  return node.type === AST_NODE_TYPES.TSArrayType;
}

export function isTSIndexSignature(
  node: TSESTree.Node
): node is TSESTree.TSIndexSignature {
  return node.type === AST_NODE_TYPES.TSIndexSignature;
}

export function isTSInterfaceBody(
  node: TSESTree.Node
): node is TSESTree.TSInterfaceBody {
  return node.type === AST_NODE_TYPES.TSInterfaceBody;
}

export function isTSParameterProperty(
  node: TSESTree.Node
): node is TSESTree.TSParameterProperty {
  return node.type === AST_NODE_TYPES.TSParameterProperty;
}

export function isTSPropertySignature(
  node: TSESTree.Node
): node is TSESTree.TSPropertySignature {
  return node.type === AST_NODE_TYPES.TSPropertySignature;
}

export function isTSTypeAliasDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSTypeAliasDeclaration {
  return node.type === AST_NODE_TYPES.TSTypeAliasDeclaration;
}

export function isTSTypeOperator(
  node: TSESTree.Node
): node is TSESTree.TSTypeOperator {
  return node.type === AST_NODE_TYPES.TSTypeOperator;
}

export function isVariableDeclaration(
  node: TSESTree.Node
): node is TSESTree.VariableDeclaration {
  return node.type === AST_NODE_TYPES.VariableDeclaration;
}

export function isVariableDeclarator(
  node: TSESTree.Node
): node is TSESTree.VariableDeclarator {
  return node.type === AST_NODE_TYPES.VariableDeclarator;
}

/*
 * TS types type guards.
 */

export function isUnionType(type: Type): type is UnionType {
  return ts !== undefined && type.flags === ts.TypeFlags.Union;
}

export function isArrayType(type: Type | null): type is ArrayType;
export function isArrayType(
  type: Type,
  assumeType: false,
  node: null
): type is ArrayType;
export function isArrayType(
  type: Type | null,
  assumeType: boolean,
  node: TSESTree.Node | null
): type is ArrayType;
export function isArrayType(
  type: null,
  assumeType: true,
  node: TSESTree.Node
): boolean;
export function isArrayType(
  type: Type | null,
  assumeType: boolean = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true
    ? node !== null
    : type !== null &&
        ((type.symbol && type.symbol.name === "Array") ||
          (isUnionType(type) &&
            type.types.some(t => isArrayType(t, false, null))));
}

export function isArrayConstructorType(
  type: Type | null
): type is ArrayConstructorType;
export function isArrayConstructorType(
  type: Type,
  assumeType: false,
  node: null
): type is ArrayConstructorType;
export function isArrayConstructorType(
  type: Type | null,
  assumeType: boolean,
  node: TSESTree.Node | null
): type is ArrayConstructorType;
export function isArrayConstructorType(
  type: null,
  assumeType: true,
  node: TSESTree.Node
): boolean;
export function isArrayConstructorType(
  type: Type | null,
  assumeType: boolean = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true
    ? node !== null && isIdentifier(node) && node.name === "Array"
    : type !== null &&
        ((type.symbol && type.symbol.name === "ArrayConstructor") ||
          (isUnionType(type) &&
            type.types.some(t => isArrayConstructorType(t, false, null))));
}

export function isObjectConstructorType(
  type: Type | null
): type is ObjectConstructorType;
export function isObjectConstructorType(
  type: Type,
  assumeType: false,
  node: null
): type is ObjectConstructorType;
export function isObjectConstructorType(
  type: Type | null,
  assumeType: boolean,
  node: TSESTree.Node | null
): type is ObjectConstructorType;
export function isObjectConstructorType(
  type: null,
  assumeType: true,
  node: TSESTree.Node
): boolean;
export function isObjectConstructorType(
  type: Type | null,
  assumeType: boolean = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true
    ? node !== null && isIdentifier(node) && node.name === "Object"
    : type !== null &&
        ((type.symbol && type.symbol.name === "ObjectConstructor") ||
          (isUnionType(type) &&
            type.types.some(t => isObjectConstructorType(t, false, null))));
}
