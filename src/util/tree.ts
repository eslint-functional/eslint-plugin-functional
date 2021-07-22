import { ASTUtils } from "@typescript-eslint/experimental-utils";
import type { TSESTree } from "@typescript-eslint/experimental-utils";

import {
  isCallExpression,
  isClassLike,
  isFunctionExpressionLike,
  isFunctionLike,
  isIdentifier,
  isMemberExpression,
  isMethodDefinition,
  isProperty,
  isTSInterfaceBody,
  isTSInterfaceHeritage,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeReference,
} from "./typeguard";

/**
 * Return the first ancestor that meets the given check criteria.
 */
function getAncestorOfType<T extends TSESTree.Node>(
  checker: (node: TSESTree.Node, child: TSESTree.Node | null) => node is T,
  node: TSESTree.Node,
  child: TSESTree.Node | null = null
): T | null {
  return checker(node, child)
    ? node
    : node.parent === null || node.parent === undefined
    ? null
    : getAncestorOfType(checker, node.parent, node);
}

/**
 * Test if the given node is in a function's body.
 */
export function inFunctionBody(node: TSESTree.Node): boolean {
  return (
    getAncestorOfType(
      (n, c): n is TSESTree.Node => isFunctionLike(n) && n.body === c,
      node
    ) !== null
  );
}

/**
 * Test if the given node is in a class.
 */
export function inClass(node: TSESTree.Node): boolean {
  return getAncestorOfType(isClassLike, node) !== null;
}

/**
 * Test if the given node is shallowly inside a `Readonly<{...}>`.
 */
export function inReadonly(node: TSESTree.Node): boolean {
  // For nested cases, we shouldn't look for any parent, but the immediate parent.
  if (
    node.parent !== null &&
    node.parent !== undefined &&
    isTSTypeLiteral(node.parent) &&
    node.parent.parent !== null &&
    node.parent.parent !== undefined &&
    isTSTypeAnnotation(node.parent.parent)
  ) {
    return false;
  }

  const expressionOrTypeName =
    getAncestorOfType(isTSTypeReference, node)?.typeName ??
    getAncestorOfType(isTSInterfaceHeritage, node)?.expression;
  return (
    ASTUtils.isIdentifier(expressionOrTypeName) &&
    expressionOrTypeName.name === "Readonly"
  );
}

/**
 * Test if the given node is in a TS Property Signature.
 */
export function inInterface(node: TSESTree.Node): boolean {
  return getAncestorOfType(isTSInterfaceBody, node) !== null;
}

/**
 * Test if the given node is in a Constructor.
 */
export function inConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = getAncestorOfType(isMethodDefinition, node);
  return (
    methodDefinition !== null &&
    isIdentifier(methodDefinition.key) &&
    methodDefinition.key.name === "constructor"
  );
}

/**
 * Is the given node in the return type.
 */
export function isInReturnType(node: TSESTree.Node): boolean {
  return (
    getAncestorOfType(
      (n): n is TSESTree.Node =>
        n.parent !== undefined &&
        n.parent !== null &&
        isFunctionLike(n.parent) &&
        n.parent.returnType === n,
      node
    ) !== null
  );
}

/**
 * Is the given identifier a property of an object?
 */
export function isPropertyAccess(node: TSESTree.Identifier): boolean {
  return (
    node.parent !== undefined &&
    isMemberExpression(node.parent) &&
    node.parent.property === node
  );
}

/**
 * Is the given identifier a property name?
 */
export function isPropertyName(node: TSESTree.Identifier): boolean {
  return (
    node.parent !== undefined &&
    isProperty(node.parent) &&
    node.parent.key === node
  );
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
