/**
 * @file Functions that typeguard the given node/type.
 */

import type { TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { ReadonlyDeep } from "type-fest";
import type { Type, UnionType } from "typescript";

import ts from "~/conditional-imports/typescript";

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
 * Basic type guards.
 */

export function isReadonlyArray(
  value: unknown
): value is ReadonlyArray<unknown> {
  return Array.isArray(value);
}

/*
 * Node type guards.
 */

export function isArrayExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ArrayExpression> {
  return node.type === AST_NODE_TYPES.ArrayExpression;
}

export function isAssignmentExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.AssignmentExpression> {
  return node.type === AST_NODE_TYPES.AssignmentExpression;
}

export function isAssignmentPattern(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.AssignmentPattern> {
  return node.type === AST_NODE_TYPES.AssignmentPattern;
}

export function isBlockStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.BlockStatement> {
  return node.type === AST_NODE_TYPES.BlockStatement;
}

export function isBreakStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.BreakStatement> {
  return node.type === AST_NODE_TYPES.BreakStatement;
}

export function isCallExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.CallExpression> {
  return node.type === AST_NODE_TYPES.CallExpression;
}

export function isPropertyDefinition(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.PropertyDefinition> {
  return node.type === AST_NODE_TYPES.PropertyDefinition;
}

/**
 * Is the given node a class node?
 *
 * It doesn't matter what type of class.
 */
export function isClassLike(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ClassDeclaration | TSESTree.ClassExpression> {
  return (
    node.type === AST_NODE_TYPES.ClassDeclaration ||
    node.type === AST_NODE_TYPES.ClassExpression
  );
}

export function isContinueStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ContinueStatement> {
  return node.type === AST_NODE_TYPES.ContinueStatement;
}

export function isExpressionStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ExpressionStatement> {
  return node.type === AST_NODE_TYPES.ExpressionStatement;
}

export function isForStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ForStatement> {
  return node.type === AST_NODE_TYPES.ForStatement;
}

export function isFunctionDeclaration(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.FunctionDeclaration> {
  return node.type === AST_NODE_TYPES.FunctionDeclaration;
}

/**
 * Is the given node a function expression node?
 *
 * It doesn't matter what type of function expression.
 */
export function isFunctionExpressionLike(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<
  TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression
> {
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
  node: ReadonlyDeep<TSESTree.Node>
): node is
  | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
  | ReadonlyDeep<TSESTree.FunctionDeclaration>
  | ReadonlyDeep<TSESTree.FunctionExpression> {
  return isFunctionDeclaration(node) || isFunctionExpressionLike(node);
}

export function isIdentifier(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.Identifier> {
  return node.type === AST_NODE_TYPES.Identifier;
}

export function isIfStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.IfStatement> {
  return node.type === AST_NODE_TYPES.IfStatement;
}

export function isMemberExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.MemberExpression> {
  return node.type === AST_NODE_TYPES.MemberExpression;
}

export function isMethodDefinition(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.MethodDefinition> {
  return node.type === AST_NODE_TYPES.MethodDefinition;
}

export function isNewExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.NewExpression> {
  return node.type === AST_NODE_TYPES.NewExpression;
}

export function isObjectExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ObjectExpression> {
  return node.type === AST_NODE_TYPES.ObjectExpression;
}

export function isProperty(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.Property> {
  return node.type === AST_NODE_TYPES.Property;
}

export function isRestElement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.RestElement> {
  return node.type === AST_NODE_TYPES.RestElement;
}

export function isReturnStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ReturnStatement> {
  return node.type === AST_NODE_TYPES.ReturnStatement;
}

export function isSwitchStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.SwitchStatement> {
  return node.type === AST_NODE_TYPES.SwitchStatement;
}

export function isThisExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ThisExpression> {
  return node.type === AST_NODE_TYPES.ThisExpression;
}

export function isThrowStatement(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.ThrowStatement> {
  return node.type === AST_NODE_TYPES.ThrowStatement;
}

export function isTSArrayType(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSArrayType> {
  return node.type === AST_NODE_TYPES.TSArrayType;
}

export function isTSFunctionType(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSFunctionType> {
  return node.type === AST_NODE_TYPES.TSFunctionType;
}

export function isTSIndexSignature(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSIndexSignature> {
  return node.type === AST_NODE_TYPES.TSIndexSignature;
}

export function isTSInterfaceDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSInterfaceDeclaration {
  return node.type === AST_NODE_TYPES.TSInterfaceDeclaration;
}

export function isTSInterfaceBody(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSInterfaceBody> {
  return node.type === AST_NODE_TYPES.TSInterfaceBody;
}

export function isTSInterfaceHeritage(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSInterfaceHeritage> {
  return node.type === AST_NODE_TYPES.TSInterfaceHeritage;
}

export function isTSTypeAliasDeclaration(
  node: TSESTree.Node
): node is TSESTree.TSTypeAliasDeclaration {
  return node.type === AST_NODE_TYPES.TSTypeAliasDeclaration;
}

export function isTSNullKeyword(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSNullKeyword> {
  return node.type === AST_NODE_TYPES.TSNullKeyword;
}

export function isTSParameterProperty(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSParameterProperty> {
  return node.type === AST_NODE_TYPES.TSParameterProperty;
}

export function isTSPropertySignature(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSPropertySignature> {
  return node.type === AST_NODE_TYPES.TSPropertySignature;
}

export function isTSTupleType(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSTupleType> {
  return node.type === AST_NODE_TYPES.TSTupleType;
}

export function isTSTypeAnnotation(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSTypeAnnotation> {
  return node.type === AST_NODE_TYPES.TSTypeAnnotation;
}

export function isTSTypeLiteral(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSTypeLiteral> {
  return node.type === AST_NODE_TYPES.TSTypeLiteral;
}

export function isTSTypeOperator(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSTypeOperator> {
  return node.type === AST_NODE_TYPES.TSTypeOperator;
}

export function isTSTypeReference(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSTypeReference> {
  return node.type === AST_NODE_TYPES.TSTypeReference;
}

export function isTSUndefinedKeyword(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSUndefinedKeyword> {
  return node.type === AST_NODE_TYPES.TSUndefinedKeyword;
}

export function isTSVoidKeyword(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.TSVoidKeyword> {
  return node.type === AST_NODE_TYPES.TSVoidKeyword;
}

export function isUnaryExpression(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.UnaryExpression> {
  return node.type === AST_NODE_TYPES.UnaryExpression;
}

export function isVariableDeclaration(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.VariableDeclaration> {
  return node.type === AST_NODE_TYPES.VariableDeclaration;
}

export function isVariableDeclarator(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.VariableDeclarator> {
  return node.type === AST_NODE_TYPES.VariableDeclarator;
}

export function hasID(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.Node & Readonly<{ id: unknown }>> {
  return Object.prototype.hasOwnProperty.call(node, "id");
}

export function hasKey(
  node: ReadonlyDeep<TSESTree.Node>
): node is ReadonlyDeep<TSESTree.Node & Readonly<{ key: unknown }>> {
  return Object.prototype.hasOwnProperty.call(node, "key");
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/*
 * TS types type guards.
 */

export function isUnionType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type
): type is UnionType {
  return ts !== undefined && type.flags === ts.TypeFlags.Union;
}

export function isArrayType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null
): type is ArrayType;
export function isArrayType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type,
  assumeType: false,
  node: null
): type is ArrayType;
export function isArrayType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType: boolean,
  node: ReadonlyDeep<TSESTree.Node | null>
): type is ArrayType;
export function isArrayType(
  type: null,
  assumeType: true,
  node: ReadonlyDeep<TSESTree.Node>
): boolean;
export function isArrayType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType = false,
  node: ReadonlyDeep<TSESTree.Node> | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null
    : type !== null &&
        ((type.symbol !== undefined && type.symbol.name === "Array") ||
          (isUnionType(type) &&
            type.types.some((t) => isArrayType(t, false, null))));
}

export function isArrayConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null
): type is ArrayConstructorType;
export function isArrayConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type,
  assumeType: false,
  node: null
): type is ArrayConstructorType;
export function isArrayConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType: boolean,
  node: ReadonlyDeep<TSESTree.Node | null>
): type is ArrayConstructorType;
export function isArrayConstructorType(
  type: null,
  assumeType: true,
  node: ReadonlyDeep<TSESTree.Node>
): boolean;
export function isArrayConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType = false,
  node: ReadonlyDeep<TSESTree.Node> | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null && isIdentifier(node) && node.name === "Array"
    : type !== null &&
        ((type.symbol !== undefined &&
          type.symbol.name === "ArrayConstructor") ||
          (isUnionType(type) &&
            type.types.some((t) => isArrayConstructorType(t, false, null))));
}

export function isObjectConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null
): type is ObjectConstructorType;
export function isObjectConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type,
  assumeType: false,
  node: null
): type is ObjectConstructorType;
export function isObjectConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType: boolean,
  node: ReadonlyDeep<TSESTree.Node | null>
): type is ObjectConstructorType;
export function isObjectConstructorType(
  type: null,
  assumeType: true,
  node: ReadonlyDeep<TSESTree.Node>
): boolean;
export function isObjectConstructorType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type | null,
  assumeType = false,
  node: ReadonlyDeep<TSESTree.Node> | null = null
): boolean {
  return assumeType === true && type === null
    ? node !== null && isIdentifier(node) && node.name === "Object"
    : type !== null &&
        ((type.symbol !== undefined &&
          type.symbol.name === "ObjectConstructor") ||
          (isUnionType(type) &&
            type.types.some((t) => isObjectConstructorType(t, false, null))));
}

export function isNeverType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type
): boolean {
  return ts !== undefined && type.flags === ts.TypeFlags.Never;
}

export function isVoidType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type
): boolean {
  return ts !== undefined && type.flags === ts.TypeFlags.Void;
}

export function isNullType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type
): boolean {
  return ts !== undefined && type.flags === ts.TypeFlags.Null;
}

export function isUndefinedType(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ignore TS Type
  type: Type
): boolean {
  return ts !== undefined && type.flags === ts.TypeFlags.Undefined;
}
