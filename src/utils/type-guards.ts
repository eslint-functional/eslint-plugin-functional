/**
 * @file Functions that type guard the given node/type.
 */

import type { TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { Type, UnionType } from "typescript";

import ts from "~/conditional-imports/typescript";

/*
 * TS Types.
 */

export type ArrayType = Type & {
  symbol: {
    name: "Array";
  };
};

export type ArrayConstructorType = Type & {
  symbol: {
    name: "ArrayConstructor";
  };
};

export type ObjectConstructorType = Type & {
  symbol: {
    name: "ObjectConstructor";
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

export function isArrayPattern(
  node: TSESTree.Node
): node is TSESTree.ArrayPattern {
  return node.type === AST_NODE_TYPES.ArrayPattern;
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

export function isBreakStatement(
  node: TSESTree.Node
): node is TSESTree.BreakStatement {
  return node.type === AST_NODE_TYPES.BreakStatement;
}

export function isCallExpression(
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  return node.type === AST_NODE_TYPES.CallExpression;
}

export function isPropertyDefinition(
  node: TSESTree.Node
): node is TSESTree.PropertyDefinition {
  return node.type === AST_NODE_TYPES.PropertyDefinition;
}

/**
 * Is the given node a class node?
 *
 * It doesn't matter what type of class.
 */
export function isClassLike(
  node: TSESTree.Node
): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression {
  return (
    node.type === AST_NODE_TYPES.ClassDeclaration ||
    node.type === AST_NODE_TYPES.ClassExpression
  );
}

export function isContinueStatement(
  node: TSESTree.Node
): node is TSESTree.ContinueStatement {
  return node.type === AST_NODE_TYPES.ContinueStatement;
}

export function isExpressionStatement(
  node: TSESTree.Node
): node is TSESTree.ExpressionStatement {
  return node.type === AST_NODE_TYPES.ExpressionStatement;
}

export function isForStatement(
  node: TSESTree.Node
): node is TSESTree.ForStatement {
  return node.type === AST_NODE_TYPES.ForStatement;
}

export function isFunctionDeclaration(
  node: TSESTree.Node
): node is TSESTree.FunctionDeclaration {
  return node.type === AST_NODE_TYPES.FunctionDeclaration;
}

/**
 * Is the given node a function expression node?
 *
 * It doesn't matter what type of function expression.
 */
export function isFunctionExpressionLike(
  node: TSESTree.Node
): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression {
  return (
    node.type === AST_NODE_TYPES.FunctionExpression ||
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
  );
}

/**
 * Is the given node a function node?
 *
 * It doesn't matter what type of function.
 */
export function isFunctionLike(
  node: TSESTree.Node
): node is
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression {
  return isFunctionDeclaration(node) || isFunctionExpressionLike(node);
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

export function isObjectExpression(
  node: TSESTree.Node
): node is TSESTree.ObjectExpression {
  return node.type === AST_NODE_TYPES.ObjectExpression;
}

export function isObjectPattern(
  node: TSESTree.Node
): node is TSESTree.ObjectPattern {
  return node.type === AST_NODE_TYPES.ObjectPattern;
}

export function isPrivateIdentifier(
  node: TSESTree.Node
): node is TSESTree.PrivateIdentifier {
  return node.type === AST_NODE_TYPES.PrivateIdentifier;
}

export function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  return node.type === AST_NODE_TYPES.Program;
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

export function isSwitchStatement(
  node: TSESTree.Node
): node is TSESTree.SwitchStatement {
  return node.type === AST_NODE_TYPES.SwitchStatement;
}

export function isThisExpression(
  node: TSESTree.Node
): node is TSESTree.ThisExpression {
  return node.type === AST_NODE_TYPES.ThisExpression;
}

export function isThrowStatement(
  node: TSESTree.Node
): node is TSESTree.ThrowStatement {
  return node.type === AST_NODE_TYPES.ThrowStatement;
}

export function isTSArrayType(
  node: TSESTree.Node
): node is TSESTree.TSArrayType {
  return node.type === AST_NODE_TYPES.TSArrayType;
}

export function isTSFunctionType(
  node: TSESTree.Node
): node is TSESTree.TSFunctionType {
  return node.type === AST_NODE_TYPES.TSFunctionType;
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

export function isTSInterfaceDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSInterfaceDeclaration {
  return node.type === AST_NODE_TYPES.TSInterfaceDeclaration;
}

export function isTSInterfaceHeritage(
  node: TSESTree.Node
): node is TSESTree.TSInterfaceHeritage {
  return node.type === AST_NODE_TYPES.TSInterfaceHeritage;
}

export function isTSNullKeyword(
  node: TSESTree.Node
): node is TSESTree.TSNullKeyword {
  return node.type === AST_NODE_TYPES.TSNullKeyword;
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

export function isTSTupleType(
  node: TSESTree.Node
): node is TSESTree.TSTupleType {
  return node.type === AST_NODE_TYPES.TSTupleType;
}

export function isTSTypeAnnotation(
  node: TSESTree.Node
): node is TSESTree.TSTypeAnnotation {
  return node.type === AST_NODE_TYPES.TSTypeAnnotation;
}

export function isTSTypeLiteral(
  node: TSESTree.Node
): node is TSESTree.TSTypeLiteral {
  return node.type === AST_NODE_TYPES.TSTypeLiteral;
}

export function isTSTypeOperator(
  node: TSESTree.Node
): node is TSESTree.TSTypeOperator {
  return node.type === AST_NODE_TYPES.TSTypeOperator;
}

export function isTSTypePredicate(
  node: TSESTree.Node
): node is TSESTree.TSTypePredicate {
  return node.type === AST_NODE_TYPES.TSTypePredicate;
}

export function isTSTypeReference(
  node: TSESTree.Node
): node is TSESTree.TSTypeReference {
  return node.type === AST_NODE_TYPES.TSTypeReference;
}

export function isTSUndefinedKeyword(
  node: TSESTree.Node
): node is TSESTree.TSUndefinedKeyword {
  return node.type === AST_NODE_TYPES.TSUndefinedKeyword;
}

export function isTSVoidKeyword(
  node: TSESTree.Node
): node is TSESTree.TSVoidKeyword {
  return node.type === AST_NODE_TYPES.TSVoidKeyword;
}

export function isUnaryExpression(
  node: TSESTree.Node
): node is TSESTree.UnaryExpression {
  return node.type === AST_NODE_TYPES.UnaryExpression;
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

export function isYieldExpression(
  node: TSESTree.Node
): node is TSESTree.YieldExpression {
  return node.type === AST_NODE_TYPES.YieldExpression;
}

export function hasID(
  node: TSESTree.Node
): node is Extract<TSESTree.Node, { id: unknown }> {
  return Object.hasOwn(node, "id");
}

export function hasKey(
  node: TSESTree.Node
): node is Extract<TSESTree.Node, { key: unknown }> {
  return Object.hasOwn(node, "key");
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
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
  assumeType = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null
    : type !== null &&
        (((type.symbol as unknown) !== undefined &&
          type.symbol.name === "Array") ||
          (isUnionType(type) &&
            type.types.some((t) => isArrayType(t, false, null))));
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
  assumeType = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null && isIdentifier(node) && node.name === "Array"
    : type !== null &&
        (((type.symbol as unknown) !== undefined &&
          type.symbol.name === "ArrayConstructor") ||
          (isUnionType(type) &&
            type.types.some((t) => isArrayConstructorType(t, false, null))));
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
  assumeType = false,
  node: TSESTree.Node | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null && isIdentifier(node) && node.name === "Object"
    : type !== null &&
        (((type.symbol as unknown) !== undefined &&
          type.symbol.name === "ObjectConstructor") ||
          (isUnionType(type) &&
            type.types.some((t) => isObjectConstructorType(t, false, null))));
}
