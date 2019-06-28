import { TSESTree } from "@typescript-eslint/typescript-estree";

import { ForXStatement } from "./types";
import {
  isClassLike,
  isForXStatement,
  isFunctionLike,
  isTSInterfaceBody
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
  return getParentOfType(isTSInterfaceBody, node) !== null;
}

/**
 * Test if the given node is in a ForX Statememt.
 */
export function getForXStatement(node: TSESTree.Node): ForXStatement | null {
  return getParentOfType<ForXStatement>(isForXStatement, node);
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
