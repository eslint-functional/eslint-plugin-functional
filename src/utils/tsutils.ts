/**
 * Need functions from tsutils.
 * Copied here so they can be patched if needed.
 * Should in future be removed and replaced with a new lib.
 *
 * @see https://github.com/typescript-eslint/typescript-eslint/issues/5552
 */

import type tsType from "typescript";

import ts from "~/conditional-imports/typescript";

export function isUnionType(type: tsType.Type): type is tsType.UnionType {
  if (ts === undefined) {
    return false;
  }
  return (type.flags & ts.TypeFlags.Union) !== 0;
}

export function unionTypeParts(type: tsType.Type): tsType.Type[] {
  return isUnionType(type) ? type.types : [type];
}

export function isIdentifier(node: tsType.Node): node is tsType.Identifier {
  if (ts === undefined) {
    return false;
  }
  return node.kind === ts.SyntaxKind.Identifier;
}
