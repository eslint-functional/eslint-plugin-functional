/**
 * This file has functions that typeguard the given node/type.
 */

import * as ts from "typescript";
import * as utils from "tsutils/typeguard/2.8";

export type AccessExpression =
  | ts.ElementAccessExpression
  | ts.PropertyAccessExpression;

export function isAccessExpression(node: ts.Node): node is AccessExpression {
  return (
    utils.isElementAccessExpression(node) ||
    utils.isPropertyAccessExpression(node)
  );
}

export function isFunctionLikeDeclaration(
  node: ts.Node
): node is ts.FunctionLikeDeclaration {
  return (
    utils.isArrowFunction(node) ||
    utils.isConstructorDeclaration(node) ||
    utils.isFunctionDeclaration(node) ||
    utils.isFunctionExpression(node) ||
    utils.isGetAccessorDeclaration(node) ||
    utils.isMethodDeclaration(node) ||
    utils.isSetAccessorDeclaration(node)
  );
}

export function isVariableLikeDeclaration(
  node: ts.Node
): node is ts.VariableLikeDeclaration {
  return (
    utils.isBindingElement(node) ||
    utils.isEnumMember(node) ||
    utils.isParameterDeclaration(node) ||
    utils.isPropertyAssignment(node) ||
    utils.isPropertyDeclaration(node) ||
    utils.isPropertySignature(node) ||
    utils.isShorthandPropertyAssignment(node) ||
    utils.isVariableDeclaration(node)
  );
}

export function isVariableOrParameterOrPropertyDeclaration(
  node: ts.Node
): node is
  | ts.VariableDeclaration
  | ts.ParameterDeclaration
  | ts.PropertyDeclaration {
  return (
    utils.isVariableDeclaration(node) ||
    utils.isParameterDeclaration(node) ||
    utils.isPropertyDeclaration(node)
  );
}

export function hasExpression(
  node: ts.Node
): node is ts.Node & { expression: ts.Node } {
  return Object.prototype.hasOwnProperty.call(node, "expression");
}
