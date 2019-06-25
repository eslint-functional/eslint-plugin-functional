import { TSESTree } from "@typescript-eslint/typescript-estree";
import {
  isClassLike,
  isFunctionLike,
  isTSPropertySignature
} from "../util/typeguard";

/**
 * Test if the given node is in a function.
 */
export function inFunction(node: TSESTree.Node) {
  return inStructure(isFunctionLike, node);
}

/**
 * Test if the given node is in a class.
 */
export function inClass(node: TSESTree.Node) {
  return inStructure(isClassLike, node);
}

/**
 * Test if the given node is in a TS Property Signature.
 */
export function inInterface(node: TSESTree.Node) {
  return inStructure(isTSPropertySignature, node);
}

/**
 * Test if the given node is in a node that meets the given checker.
 */
function inStructure(
  func: (node: TSESTree.Node) => boolean,
  node: TSESTree.Node
) {
  let n: TSESTree.Node | undefined = node;
  while ((n = n.parent)) {
    if (func(n)) {
      return true;
    }
  }
  return false;
}
