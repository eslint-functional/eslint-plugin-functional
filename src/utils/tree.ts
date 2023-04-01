import type { TSESTree } from "@typescript-eslint/utils";

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
  isProperty,
  isTSInterfaceBody,
  isTSInterfaceHeritage,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeReference,
} from "./type-guards";

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
export function isInFunctionBody(
  node: TSESTree.Node,
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
 * Test if the given node is in a class.
 */
export function isInClass(node: TSESTree.Node): boolean {
  return getAncestorOfType(isClassLike, node) !== null;
}

/**
 * Test if the given node is in a for loop initializer.
 */
export function isInForLoopInitializer(node: TSESTree.Node): boolean {
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
export function isInReadonly(node: TSESTree.Node): boolean {
  return getReadonly(node) !== null;
}

/**
 * Test if the given node is shallowly inside a `Readonly<{...}>`.
 */
export function getReadonly(
  node: TSESTree.Node
): TSESTree.TSTypeReference | TSESTree.TSInterfaceHeritage | null {
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
  const intHerit = getAncestorOfType(isTSInterfaceHeritage, node);

  const expressionOrTypeName = typeRef?.typeName ?? intHerit?.expression;

  return expressionOrTypeName !== undefined &&
    isIdentifier(expressionOrTypeName) &&
    expressionOrTypeName.name === "Readonly"
    ? typeRef ?? intHerit
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
        isDefined(n.parent) &&
        isFunctionLike(n.parent) &&
        n.parent.returnType === n,
      node
    ) !== null
  );
}

/**
 * Test if the given node is nested inside another statement.
 */
export function isNested(node: TSESTree.Node): boolean {
  return (
    node.parent !== undefined &&
    !(isProgram(node.parent) || isBlockStatement(node.parent))
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

/**
 * Is the given node being passed as an argument?
 */
export function isArgument(node: TSESTree.Node): boolean {
  return (
    node.parent !== undefined &&
    isCallExpression(node.parent) &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    node.parent.arguments.includes(node as any)
  );
}

/**
 * Get the key the given node is assigned to in its parent ObjectExpression.
 */
export function getKeyOfValueInObjectExpression(
  node: TSESTree.Node
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

  const objectExpressionProp = objectExpressionProps[0]!;
  if (
    !isProperty(objectExpressionProp) ||
    !isIdentifier(objectExpressionProp.key)
  ) {
    return null;
  }

  return objectExpressionProp.key.name;
}
