import assert from "node:assert/strict";

import type { TSESTree } from "@typescript-eslint/utils";
import { getParserServices } from "@typescript-eslint/utils/eslint-utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import typescript from "#/conditional-imports/typescript";

import { type BaseOptions, getTypeOfNode } from "./rule";
import {
  isBlockStatement,
  isCallExpression,
  isClassLike,
  isDefined,
  isForStatement,
  isFunctionExpressionLike,
  isFunctionLike,
  isIdentifier,
  isMemberExpression,
  isMethodDefinition,
  isObjectExpression,
  isProgram,
  isPromiseType,
  isProperty,
  isTSInterfaceBody,
  isTSInterfaceHeritage,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeReference,
  isTryStatement,
  isVariableDeclaration,
} from "./type-guards";

/**
 * Return the first ancestor that meets the given check criteria.
 */
function getAncestorOfType<T extends TSESTree.Node>(
  checker: (node: TSESTree.Node, child: TSESTree.Node | null) => node is T,
  node: TSESTree.Node,
  child: TSESTree.Node | null = null,
): T | null {
  return checker(node, child) ? node : isDefined(node.parent) ? getAncestorOfType(checker, node.parent, node) : null;
}

/**
 * Test if the given node is in a function's body.
 *
 * @param node - The node to test.
 * @param async - Whether the function must be async or sync. Use `undefined` for either.
 */
export function isInFunctionBody(node: TSESTree.Node, async?: boolean): boolean {
  const functionNode = getEnclosingFunction(node);

  return functionNode !== null && (async === undefined || functionNode.async === async);
}

/**
 * Get the function the given node is in.
 *
 * Will return null if not in a function.
 */
export function getEnclosingFunction(
  node: TSESTree.Node,
): TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | null {
  return getAncestorOfType(
    (n, c): n is TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression =>
      isFunctionLike(n) && n.body === c,
    node,
  );
}

/**
 * Get the function the given node is in.
 *
 * Will return null if not in a function.
 */
export function getEnclosingTryStatement(node: TSESTree.Node): TSESTree.TryStatement | null {
  return getAncestorOfType((n, c): n is TSESTree.TryStatement => isTryStatement(n) && n.block === c, node);
}

/**
 * Test if the given node is in a class.
 */
export function isInClass(node: TSESTree.Node): boolean {
  return getAncestorOfType(isClassLike, node) !== null;
}

/**
 * Test if the given node is in a for loop initializer.
 */
export function isInForLoopInitializer(node: TSESTree.Node): boolean {
  return getAncestorOfType((n, c): n is TSESTree.ForStatement => isForStatement(n) && n.init === c, node) !== null;
}

/**
 * Test if the given node is shallowly inside a `Readonly<{...}>`.
 */
export function isInReadonly(node: TSESTree.Node): boolean {
  return getReadonly(node) !== null;
}

/**
 * Test if the given node is in a handler function callback of a promise.
 */
export function isInPromiseHandlerFunction<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Node,
  context: Context,
): boolean {
  const functionNode = getAncestorOfType((n, c): n is TSESTree.FunctionLike => isFunctionLike(n) && n.body === c, node);

  if (
    functionNode === null ||
    !isCallExpression(functionNode.parent) ||
    !isMemberExpression(functionNode.parent.callee) ||
    !isIdentifier(functionNode.parent.callee.property)
  ) {
    return false;
  }

  const objectType = getTypeOfNode(functionNode.parent.callee.object, context);
  return isPromiseType(context, objectType);
}

/**
 * Test if the given node is shallowly inside a `Readonly<{...}>`.
 */
export function getReadonly(node: TSESTree.Node): TSESTree.TSTypeReference | TSESTree.TSInterfaceHeritage | null {
  // For nested cases, we shouldn't look for any parent, but the immediate parent.
  if (
    isDefined(node.parent) &&
    isTSTypeLiteral(node.parent) &&
    isDefined(node.parent.parent) &&
    isTSTypeAnnotation(node.parent.parent)
  ) {
    return null;
  }

  const typeRef = getAncestorOfType(isTSTypeReference, node);
  const intHeritage = getAncestorOfType(isTSInterfaceHeritage, node);

  const expressionOrTypeName = typeRef?.typeName ?? intHeritage?.expression;

  return expressionOrTypeName !== undefined &&
    isIdentifier(expressionOrTypeName) &&
    expressionOrTypeName.name === "Readonly"
    ? (typeRef ?? intHeritage)
    : null;
}

/**
 * Test if the given node is in a TS Property Signature.
 */
export function isInInterface(node: TSESTree.Node): boolean {
  return getAncestorOfType(isTSInterfaceBody, node) !== null;
}

/**
 * Test if the given node is in a Constructor.
 */
export function isInConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = getAncestorOfType(isMethodDefinition, node);
  return methodDefinition !== null && isIdentifier(methodDefinition.key) && methodDefinition.key.name === "constructor";
}

/**
 * Is the given node in the return type.
 */
export function isInReturnType(node: TSESTree.Node): boolean {
  return (
    getAncestorOfType(
      (n): n is TSESTree.Node => isDefined(n.parent) && isFunctionLike(n.parent) && n.parent.returnType === n,
      node,
    ) !== null
  );
}

/**
 * Test if the given node is nested inside another statement.
 */
export function isNested(node: TSESTree.Node): boolean {
  return node.parent !== undefined && !(isProgram(node.parent) || isBlockStatement(node.parent));
}

/**
 * Is the given identifier a property of an object?
 */
export function isPropertyAccess(node: TSESTree.Identifier): boolean {
  return node.parent !== undefined && isMemberExpression(node.parent) && node.parent.property === node;
}

/**
 * Is the given identifier a property name?
 */
export function isPropertyName(node: TSESTree.Identifier): boolean {
  return node.parent !== undefined && isProperty(node.parent) && node.parent.key === node;
}

/**
 * Is the given function an IIFE?
 */
export function isIIFE(node: TSESTree.Node): boolean {
  return (
    isFunctionExpressionLike(node) &&
    node.parent !== undefined &&
    isCallExpression(node.parent) &&
    node.parent.callee === node
  );
}

/**
 * Is the given node being passed as an argument?
 */
export function isArgument(node: TSESTree.Node): boolean {
  return node.parent !== undefined && isCallExpression(node.parent) && node.parent.arguments.includes(node as any);
}

/**
 * Is the given node a parameter?
 */
export function isParameter(node: TSESTree.Node): boolean {
  return node.parent !== undefined && isFunctionLike(node.parent) && node.parent.params.includes(node as any);
}

/**
 * Is the given node a getter function?
 */
export function isGetter(node: TSESTree.Node): boolean {
  return node.parent !== undefined && isProperty(node.parent) && node.parent.kind === "get";
}

/**
 * Is the given node a setter function?
 */
export function isSetter(node: TSESTree.Node): boolean {
  return node.parent !== undefined && isProperty(node.parent) && node.parent.kind === "set";
}

/**
 * Get the key the given node is assigned to in its parent ObjectExpression.
 */
export function getKeyOfValueInObjectExpression(node: TSESTree.Node): string | null {
  if (!isDefined(node.parent)) {
    return null;
  }

  const objectExpression = getAncestorOfType(isObjectExpression, node);
  if (objectExpression === null) {
    return null;
  }

  const objectExpressionProps = objectExpression.properties.filter((prop) => isProperty(prop) && prop.value === node);
  if (objectExpressionProps.length !== 1) {
    return null;
  }

  const objectExpressionProp = objectExpressionProps[0]!;
  if (!isProperty(objectExpressionProp) || !isIdentifier(objectExpressionProp.key)) {
    return null;
  }

  return objectExpressionProp.key.name;
}

/**
 * Is the given identifier defined by a mutable variable (let or var)?
 */
export function isDefinedByMutableVariable<Context extends RuleContext<string, BaseOptions>>(
  node: TSESTree.Identifier,
  context: Context,
  treatParametersAsMutable: (node: TSESTree.Node) => boolean,
): boolean {
  assert(typescript !== undefined);

  const services = getParserServices(context);
  const symbol = services.getSymbolAtLocation(node);
  const variableDeclaration = symbol?.valueDeclaration;

  if (variableDeclaration === undefined) {
    return true;
  }
  const variableDeclarationNode = services.tsNodeToESTreeNodeMap.get(variableDeclaration);
  if (variableDeclarationNode !== undefined && isParameter(variableDeclarationNode)) {
    return treatParametersAsMutable(variableDeclarationNode);
  }
  if (!typescript.isVariableDeclaration(variableDeclaration)) {
    return true;
  }

  const variableDeclarator = services.tsNodeToESTreeNodeMap.get(variableDeclaration);

  if (variableDeclarator?.parent === undefined || !isVariableDeclaration(variableDeclarator.parent)) {
    return true;
  }

  return variableDeclarator.parent.kind !== "const";
}

/**
 * Get the root identifier of an expression.
 */
export function findRootIdentifier(node: TSESTree.Expression): TSESTree.Identifier | undefined {
  if (isIdentifier(node)) {
    return node;
  }
  if (isMemberExpression(node)) {
    return findRootIdentifier(node.object);
  }
  return undefined;
}
