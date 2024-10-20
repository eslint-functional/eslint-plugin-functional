/**
 * @file Functions that type guard the given node/type.
 */

import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import typeMatchesSpecifier, { type TypeDeclarationSpecifier } from "ts-declaration-location";
import type { Program, Type, UnionType } from "typescript";

import typescript from "#/conditional-imports/typescript";

const libSpecifier = {
  from: "lib",
} satisfies TypeDeclarationSpecifier;

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

export function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression {
  return node.type === AST_NODE_TYPES.ArrayExpression;
}

export function isArrayPattern(node: TSESTree.Node): node is TSESTree.ArrayPattern {
  return node.type === AST_NODE_TYPES.ArrayPattern;
}

export function isAssignmentExpression(node: TSESTree.Node): node is TSESTree.AssignmentExpression {
  return node.type === AST_NODE_TYPES.AssignmentExpression;
}

export function isAssignmentPattern(node: TSESTree.Node): node is TSESTree.AssignmentPattern {
  return node.type === AST_NODE_TYPES.AssignmentPattern;
}

export function isBlockStatement(node: TSESTree.Node): node is TSESTree.BlockStatement {
  return node.type === AST_NODE_TYPES.BlockStatement;
}

export function isBreakStatement(node: TSESTree.Node): node is TSESTree.BreakStatement {
  return node.type === AST_NODE_TYPES.BreakStatement;
}

export function isCallExpression(node: TSESTree.Node): node is TSESTree.CallExpression {
  return node.type === AST_NODE_TYPES.CallExpression;
}

export function isChainExpression(node: TSESTree.Node): node is TSESTree.ChainExpression {
  return node.type === AST_NODE_TYPES.ChainExpression;
}

export function isPropertyDefinition(node: TSESTree.Node): node is TSESTree.PropertyDefinition {
  return node.type === AST_NODE_TYPES.PropertyDefinition;
}

/**
 * Is the given node a class node?
 *
 * It doesn't matter what type of class.
 */
export function isClassLike(node: TSESTree.Node): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression {
  return node.type === AST_NODE_TYPES.ClassDeclaration || node.type === AST_NODE_TYPES.ClassExpression;
}

export function isContinueStatement(node: TSESTree.Node): node is TSESTree.ContinueStatement {
  return node.type === AST_NODE_TYPES.ContinueStatement;
}

export function isExpressionStatement(node: TSESTree.Node): node is TSESTree.ExpressionStatement {
  return node.type === AST_NODE_TYPES.ExpressionStatement;
}

export function isForStatement(node: TSESTree.Node): node is TSESTree.ForStatement {
  return node.type === AST_NODE_TYPES.ForStatement;
}

export function isFunctionDeclaration(node: TSESTree.Node): node is TSESTree.FunctionDeclaration {
  return node.type === AST_NODE_TYPES.FunctionDeclaration;
}

/**
 * Is the given node a function expression node?
 *
 * It doesn't matter what type of function expression.
 */
export function isFunctionExpressionLike(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression {
  return node.type === AST_NODE_TYPES.FunctionExpression || node.type === AST_NODE_TYPES.ArrowFunctionExpression;
}

/**
 * Is the given node a function node?
 *
 * It doesn't matter what type of function.
 */
export function isFunctionLike(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression {
  return isFunctionDeclaration(node) || isFunctionExpressionLike(node);
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier;
}

export function isIfStatement(node: TSESTree.Node): node is TSESTree.IfStatement {
  return node.type === AST_NODE_TYPES.IfStatement;
}

export function isLabeledStatement(node: TSESTree.Node): node is TSESTree.LabeledStatement {
  return node.type === AST_NODE_TYPES.LabeledStatement;
}

export function isMemberExpression(node: TSESTree.Node): node is TSESTree.MemberExpression {
  return node.type === AST_NODE_TYPES.MemberExpression;
}

export function isMethodDefinition(node: TSESTree.Node): node is TSESTree.MethodDefinition {
  return node.type === AST_NODE_TYPES.MethodDefinition;
}

export function isNewExpression(node: TSESTree.Node): node is TSESTree.NewExpression {
  return node.type === AST_NODE_TYPES.NewExpression;
}

export function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression {
  return node.type === AST_NODE_TYPES.ObjectExpression;
}

export function isObjectPattern(node: TSESTree.Node): node is TSESTree.ObjectPattern {
  return node.type === AST_NODE_TYPES.ObjectPattern;
}

export function isPrivateIdentifier(node: TSESTree.Node): node is TSESTree.PrivateIdentifier {
  return node.type === AST_NODE_TYPES.PrivateIdentifier;
}

export function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  return node.type === AST_NODE_TYPES.Program;
}

export function isProperty(node: TSESTree.Node): node is TSESTree.Property {
  return node.type === AST_NODE_TYPES.Property;
}

export function isRestElement(node: TSESTree.Node): node is TSESTree.RestElement {
  return node.type === AST_NODE_TYPES.RestElement;
}

export function isReturnStatement(node: TSESTree.Node): node is TSESTree.ReturnStatement {
  return node.type === AST_NODE_TYPES.ReturnStatement;
}

export function isSwitchStatement(node: TSESTree.Node): node is TSESTree.SwitchStatement {
  return node.type === AST_NODE_TYPES.SwitchStatement;
}

export function isThisExpression(node: TSESTree.Node): node is TSESTree.ThisExpression {
  return node.type === AST_NODE_TYPES.ThisExpression;
}

export function isThrowStatement(node: TSESTree.Node): node is TSESTree.ThrowStatement {
  return node.type === AST_NODE_TYPES.ThrowStatement;
}

export function isTryStatement(node: TSESTree.Node): node is TSESTree.TryStatement {
  return node.type === AST_NODE_TYPES.TryStatement;
}

export function isTSArrayType(node: TSESTree.Node): node is TSESTree.TSArrayType {
  return node.type === AST_NODE_TYPES.TSArrayType;
}

export function isTSAsExpression(node: TSESTree.Node): node is TSESTree.TSAsExpression {
  return node.type === AST_NODE_TYPES.TSAsExpression;
}

export function isTSFunctionType(node: TSESTree.Node): node is TSESTree.TSFunctionType {
  return node.type === AST_NODE_TYPES.TSFunctionType;
}

export function isTSIndexSignature(node: TSESTree.Node): node is TSESTree.TSIndexSignature {
  return node.type === AST_NODE_TYPES.TSIndexSignature;
}

export function isTSMethodSignature(node: TSESTree.Node): node is TSESTree.TSMethodSignature {
  return node.type === AST_NODE_TYPES.TSMethodSignature;
}

export function isTSCallSignatureDeclaration(node: TSESTree.Node): node is TSESTree.TSCallSignatureDeclaration {
  return node.type === AST_NODE_TYPES.TSCallSignatureDeclaration;
}

export function isTSConstructSignatureDeclaration(
  node: TSESTree.Node,
): node is TSESTree.TSConstructSignatureDeclaration {
  return node.type === AST_NODE_TYPES.TSConstructSignatureDeclaration;
}

export function isTSInterfaceBody(node: TSESTree.Node): node is TSESTree.TSInterfaceBody {
  return node.type === AST_NODE_TYPES.TSInterfaceBody;
}

export function isTSInterfaceDeclaration(node: TSESTree.Node): node is TSESTree.TSInterfaceDeclaration {
  return node.type === AST_NODE_TYPES.TSInterfaceDeclaration;
}

export function isTSInterfaceHeritage(node: TSESTree.Node): node is TSESTree.TSInterfaceHeritage {
  return node.type === AST_NODE_TYPES.TSInterfaceHeritage;
}

export function isTSNonNullExpression(node: TSESTree.Node): node is TSESTree.TSNonNullExpression {
  return node.type === AST_NODE_TYPES.TSNonNullExpression;
}

export function isTSNullKeyword(node: TSESTree.Node): node is TSESTree.TSNullKeyword {
  return node.type === AST_NODE_TYPES.TSNullKeyword;
}

export function isTSParameterProperty(node: TSESTree.Node): node is TSESTree.TSParameterProperty {
  return node.type === AST_NODE_TYPES.TSParameterProperty;
}

export function isTSPropertySignature(node: TSESTree.Node): node is TSESTree.TSPropertySignature {
  return node.type === AST_NODE_TYPES.TSPropertySignature;
}

export function isTSTupleType(node: TSESTree.Node): node is TSESTree.TSTupleType {
  return node.type === AST_NODE_TYPES.TSTupleType;
}

export function isTSTypeAnnotation(node: TSESTree.Node): node is TSESTree.TSTypeAnnotation {
  return node.type === AST_NODE_TYPES.TSTypeAnnotation;
}

export function isTSTypeLiteral(node: TSESTree.Node): node is TSESTree.TSTypeLiteral {
  return node.type === AST_NODE_TYPES.TSTypeLiteral;
}

export function isTSTypeOperator(node: TSESTree.Node): node is TSESTree.TSTypeOperator {
  return node.type === AST_NODE_TYPES.TSTypeOperator;
}

export function isTSTypePredicate(node: TSESTree.Node): node is TSESTree.TSTypePredicate {
  return node.type === AST_NODE_TYPES.TSTypePredicate;
}

export function isTSTypeReference(node: TSESTree.Node): node is TSESTree.TSTypeReference {
  return node.type === AST_NODE_TYPES.TSTypeReference;
}

export function isTSUndefinedKeyword(node: TSESTree.Node): node is TSESTree.TSUndefinedKeyword {
  return node.type === AST_NODE_TYPES.TSUndefinedKeyword;
}

export function isTSVoidKeyword(node: TSESTree.Node): node is TSESTree.TSVoidKeyword {
  return node.type === AST_NODE_TYPES.TSVoidKeyword;
}

export function isUnaryExpression(node: TSESTree.Node): node is TSESTree.UnaryExpression {
  return node.type === AST_NODE_TYPES.UnaryExpression;
}

export function isVariableDeclaration(node: TSESTree.Node): node is TSESTree.VariableDeclaration {
  return node.type === AST_NODE_TYPES.VariableDeclaration;
}

export function isVariableDeclarator(node: TSESTree.Node): node is TSESTree.VariableDeclarator {
  return node.type === AST_NODE_TYPES.VariableDeclarator;
}

export function isYieldExpression(node: TSESTree.Node): node is TSESTree.YieldExpression {
  return node.type === AST_NODE_TYPES.YieldExpression;
}

export function hasID(node: TSESTree.Node): node is Extract<TSESTree.Node, { id: unknown }> {
  return Object.hasOwn(node, "id");
}

export function hasKey(node: TSESTree.Node): node is Extract<TSESTree.Node, { key: unknown }> {
  return Object.hasOwn(node, "key");
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/*
 * TS types type guards.
 */

export function isUnionType(type: Type): type is UnionType {
  return typescript !== undefined && type.flags === typescript.TypeFlags.Union;
}

export function isFunctionLikeType(type: Type | null): boolean {
  return type !== null && type.getCallSignatures().length > 0;
}

export function isArrayType(context: RuleContext<string, ReadonlyArray<unknown>>, type: Type | null): boolean {
  return typeMatches(context, "Array", type);
}

export function isArrayConstructorType(
  context: RuleContext<string, ReadonlyArray<unknown>>,
  type: Type | null,
): boolean {
  return typeMatches(context, "ArrayConstructor", type);
}

export function isObjectConstructorType(
  context: RuleContext<string, ReadonlyArray<unknown>>,
  type: Type | null,
): boolean {
  return typeMatches(context, "ObjectConstructor", type);
}

export function isPromiseType(context: RuleContext<string, ReadonlyArray<unknown>>, type: Type | null): boolean {
  return typeMatches(context, "Promise", type);
}

function typeMatches(
  context: RuleContext<string, ReadonlyArray<unknown>>,
  typeName: string,
  type: Type | null,
): boolean {
  if (type === null) {
    return false;
  }
  const program = context.sourceCode.parserServices?.program ?? undefined;
  if (program === undefined) {
    return false;
  }
  return typeMatchesHelper(program, typeName)(type);
}

function typeMatchesHelper(program: Program, typeName: string): (type: Type) => boolean {
  return function test(type: Type) {
    return (
      ((type.symbol as unknown) !== undefined &&
        type.symbol.name === typeName &&
        typeMatchesSpecifier(program, libSpecifier, type)) ||
      (isUnionType(type) && type.types.some(test))
    );
  };
}
