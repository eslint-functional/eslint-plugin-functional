import type { TSESTree } from "@typescript-eslint/utils";
import type { ReadonlyDeep } from "type-fest";

import {
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
  isProperty,
  isTSIndexSignature,
  isTSInterfaceBody,
  isTSInterfaceHeritage,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeReference,
  isTSInterfaceDeclaration,
  isTSTypeAliasDeclaration,
} from "./typeguard";

/**
 * Return the first ancestor that meets the given check criteria.
 */
function getAncestorOfType<T extends ReadonlyDeep<TSESTree.Node>>(
  checker: (
    node: ReadonlyDeep<TSESTree.Node>,
    child: ReadonlyDeep<TSESTree.Node> | null
  ) => node is T,
  node: ReadonlyDeep<TSESTree.Node>,
  child: ReadonlyDeep<TSESTree.Node> | null = null
): T | null {
  return checker(node, child)
    ? node
    : isDefined(node.parent)
    ? getAncestorOfType(checker, node.parent, node)
    : null;
}

/**
 * Test if the given node is in a function's body.
 *
 * @param node - The node to test.
 * @param async - Whether the function must be async or sync. Use `undefined` for either.
 */
export function inFunctionBody(
  node: ReadonlyDeep<TSESTree.Node>,
  async?: boolean
): boolean {
  const functionNode = getAncestorOfType(
    (
      n,
      c
    ): n is
      | TSESTree.ArrowFunctionExpression
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression => isFunctionLike(n) && n.body === c,
    node
  );

  return (
    functionNode !== null &&
    (async === undefined || functionNode.async === async)
  );
}

/**
 * Get the type alias or interface that the given node is in.
 */
export function getTypeDeclaration(
  node: TSESTree.Node
): TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration | null {
  if (isTSTypeAliasDeclaration(node) || isTSInterfaceDeclaration(node)) {
    return node;
  }

  return (getAncestorOfType(
    (n): n is TSESTree.Node =>
      n.parent !== undefined &&
      n.parent !== null &&
      ((isTSTypeAliasDeclaration(n.parent) && n.parent.typeAnnotation === n) ||
        (isTSInterfaceDeclaration(n.parent) && n.parent.body === n)),
    node
  )?.parent ?? null) as
    | TSESTree.TSInterfaceDeclaration
    | TSESTree.TSTypeAliasDeclaration
    | null;
}

/**
 * Get the parent Index Signature that the given node is in.
 */
export function getParentIndexSignature(
  node: TSESTree.Node
): TSESTree.TSIndexSignature | null {
  return (getAncestorOfType(
    (n): n is TSESTree.Node =>
      n.parent !== undefined &&
      n.parent !== null &&
      isTSIndexSignature(n.parent) &&
      n.parent.typeAnnotation === n,
    node
  )?.parent ?? null) as TSESTree.TSIndexSignature | null;
}

/**
 * Test if the given node is in a class.
 */
export function inClass(node: ReadonlyDeep<TSESTree.Node>): boolean {
  return getAncestorOfType(isClassLike, node) !== null;
}

/**
 * Test if the given node is in a for loop initializer.
 */
export function inForLoopInitializer(
  node: ReadonlyDeep<TSESTree.Node>
): boolean {
  return (
    getAncestorOfType(
      (n, c): n is TSESTree.ForStatement => isForStatement(n) && n.init === c,
      node
    ) !== null
  );
}

/**
 * Test if the given node is shallowly inside a `Readonly<{...}>`.
 */
export function inReadonly(node: ReadonlyDeep<TSESTree.Node>): boolean {
  // For nested cases, we shouldn't look for any parent, but the immediate parent.
  if (
    isDefined(node.parent) &&
    isTSTypeLiteral(node.parent) &&
    isDefined(node.parent.parent) &&
    isTSTypeAnnotation(node.parent.parent)
  ) {
    return false;
  }

  const expressionOrTypeName =
    getAncestorOfType(isTSTypeReference, node)?.typeName ??
    getAncestorOfType(isTSInterfaceHeritage, node)?.expression;
  return (
    expressionOrTypeName !== undefined &&
    isIdentifier(expressionOrTypeName) &&
    expressionOrTypeName.name === "Readonly"
  );
}

/**
 * Test if the given node is in a TS Property Signature.
 */
export function inInterface(node: ReadonlyDeep<TSESTree.Node>): boolean {
  return getAncestorOfType(isTSInterfaceBody, node) !== null;
}

/**
 * Test if the given node is in a Constructor.
 */
export function inConstructor(node: ReadonlyDeep<TSESTree.Node>): boolean {
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
export function isInReturnType(node: ReadonlyDeep<TSESTree.Node>): boolean {
  return (
    getAncestorOfType(
      (n): n is TSESTree.Node =>
        isDefined(n.parent) &&
        isFunctionLike(n.parent) &&
        n.parent.returnType === n,
      node
    ) !== null
  );
}

/**
 * Is the given identifier a property of an object?
 */
export function isPropertyAccess(
  node: ReadonlyDeep<TSESTree.Identifier>
): boolean {
  return (
    node.parent !== undefined &&
    isMemberExpression(node.parent) &&
    node.parent.property === node
  );
}

/**
 * Is the given identifier a property name?
 */
export function isPropertyName(
  node: ReadonlyDeep<TSESTree.Identifier>
): boolean {
  return (
    node.parent !== undefined &&
    isProperty(node.parent) &&
    node.parent.key === node
  );
}

/**
 * Is the given function an IIFE?
 */
export function isIIFE(node: ReadonlyDeep<TSESTree.Node>): boolean {
  return (
    isFunctionExpressionLike(node) &&
    node.parent !== undefined &&
    isCallExpression(node.parent) &&
    node.parent.callee === node
  );
}

/**
 * Get the key the given node is assigned to in its parent ObjectExpression.
 */
export function getKeyOfValueInObjectExpression(
  node: ReadonlyDeep<TSESTree.Node>
): string | null {
  if (!isDefined(node.parent)) {
    return null;
  }

  const objectExpression = getAncestorOfType(isObjectExpression, node);
  if (objectExpression === null) {
    return null;
  }

  const objectExpressionProps = objectExpression.properties.filter(
    (prop) => isProperty(prop) && prop.value === node
  );
  if (objectExpressionProps.length !== 1) {
    return null;
  }

  const objectExpressionProp = objectExpressionProps[0];
  if (
    !isProperty(objectExpressionProp) ||
    !isIdentifier(objectExpressionProp.key)
  ) {
    return null;
  }

  return objectExpressionProp.key.name;
}
