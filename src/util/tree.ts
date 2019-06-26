import { TSESTree } from "@typescript-eslint/typescript-estree";

import {
  isClassLike,
  isFunctionLike,
  isTSPropertySignature,
  isVariableDeclaration
} from "./typeguard";

/**
 * Test if the given node is in a function.
 */
export function inFunction(node: TSESTree.Node): boolean {
  return getParentOfType(isFunctionLike, node) !== null;
}

/**
 * Test if the given node is in a class.
 */
export function inClass(node: TSESTree.Node): boolean {
  return getParentOfType(isClassLike, node) !== null;
}

/**
 * Test if the given node is in a TS Property Signature.
 */
export function inInterface(node: TSESTree.Node): boolean {
  return getParentOfType(isTSPropertySignature, node) !== null;
}

/**
 * Get the VariableDeclaration for the given VariableDeclarator.
 */
export function getVariableDeclaration(
  node: TSESTree.VariableDeclarator
): TSESTree.VariableDeclaration | null {
  return getParentOfType<TSESTree.VariableDeclaration>(
    isVariableDeclaration,
    node
  );
}

/**
 * Return the parent that meets the given check criteria.
 */
function getParentOfType<T extends TSESTree.Node>(
  checker: (node: TSESTree.Node) => node is T,
  node: TSESTree.Node
): T | null {
  let n: TSESTree.Node | undefined = node;
  while ((n = n.parent)) {
    if (checker(n)) {
      return n;
    }
  }
  return null;
}
