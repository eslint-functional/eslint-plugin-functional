import assert from "node:assert/strict";

import type { TypeDeclarationSpecifier } from "ts-declaration-location";
import type { Program, Type, TypeNode } from "typescript";

import ts from "#/conditional-imports/typescript";

export type TypePattern = string | RegExp;

type TypeSpecifierPattern = {
  include?: TypePattern[];
  exclude?: TypePattern[];
};

/**
 * How a type can be specified.
 */
export type TypeSpecifier = TypeSpecifierPattern & TypeDeclarationSpecifier;

export type RawTypeSpecifier = {
  name?: string | string[];
  pattern?: string | string[];
  ignoreName?: string | string[];
  ignorePattern?: string | string[];
} & TypeDeclarationSpecifier;

export function typeMatchesPattern(
  program: Program,
  type: Type,
  typeNode: TypeNode | null,
  include: ReadonlyArray<TypePattern>,
  exclude: ReadonlyArray<TypePattern> = [],
) {
  assert(ts !== undefined);

  if (include.length === 0) {
    return false;
  }

  let mut_shouldInclude = false;

  const typeNameAlias = getTypeAliasName(type, typeNode);
  if (typeNameAlias !== null) {
    const testTypeNameAlias = (pattern: TypePattern) =>
      typeof pattern === "string" ? pattern === typeNameAlias : pattern.test(typeNameAlias);

    if (exclude.some(testTypeNameAlias)) {
      return false;
    }
    mut_shouldInclude ||= include.some(testTypeNameAlias);
  }

  const typeValue = getTypeAsString(program, type, typeNode);
  const testTypeValue = (pattern: TypePattern) =>
    typeof pattern === "string" ? pattern === typeValue : pattern.test(typeValue);

  if (exclude.some(testTypeValue)) {
    return false;
  }
  mut_shouldInclude ||= include.some(testTypeValue);

  const typeNameName = extractTypeName(typeValue);
  if (typeNameName !== null) {
    const testTypeNameName = (pattern: TypePattern) =>
      typeof pattern === "string" ? pattern === typeNameName : pattern.test(typeNameName);

    if (exclude.some(testTypeNameName)) {
      return false;
    }
    mut_shouldInclude ||= include.some(testTypeNameName);
  }

  // Special handling for arrays not written in generic syntax.
  if (program.getTypeChecker().isArrayType(type) && typeNode !== null) {
    if (
      (ts.isTypeOperatorNode(typeNode) && typeNode.operator === ts.SyntaxKind.ReadonlyKeyword) ||
      (ts.isTypeOperatorNode(typeNode.parent) && typeNode.parent.operator === ts.SyntaxKind.ReadonlyKeyword)
    ) {
      const testIsReadonlyArray = (pattern: TypePattern) => typeof pattern === "string" && pattern === "ReadonlyArray";

      if (exclude.some(testIsReadonlyArray)) {
        return false;
      }
      mut_shouldInclude ||= include.some(testIsReadonlyArray);
    } else {
      const testIsArray = (pattern: TypePattern) => typeof pattern === "string" && pattern === "Array";

      if (exclude.some(testIsArray)) {
        return false;
      }
      mut_shouldInclude ||= include.some(testIsArray);
    }
  }

  return mut_shouldInclude;
}

/**
 * Get the type alias name from the given type data.
 *
 * Null will be returned if the type is not a type alias.
 */
function getTypeAliasName(type: Type, typeNode: TypeNode | null) {
  assert(ts !== undefined);

  if (typeNode === null) {
    const t = "target" in type ? (type.target as Type) : type;
    return t.aliasSymbol?.getName() ?? null;
  }

  return ts.isTypeAliasDeclaration(typeNode.parent) ? typeNode.parent.name.getText() : null;
}

/**
 * Get the type as a string.
 */
function getTypeAsString(program: Program, type: Type, typeNode: TypeNode | null) {
  assert(ts !== undefined);

  return typeNode === null
    ? program
        .getTypeChecker()
        .typeToString(
          type,
          undefined,
          ts.TypeFormatFlags.AddUndefined |
            ts.TypeFormatFlags.NoTruncation |
            ts.TypeFormatFlags.OmitParameterModifiers |
            ts.TypeFormatFlags.UseFullyQualifiedType |
            ts.TypeFormatFlags.WriteArrayAsGenericType |
            ts.TypeFormatFlags.WriteArrowStyleSignature |
            ts.TypeFormatFlags.WriteTypeArgumentsOfSignature,
        )
    : typeNode.getText();
}

/**
 * Get the type name extracted from the the type's string.
 *
 * This only work if the type is a type reference.
 */
function extractTypeName(typeValue: string) {
  const match = /^([^<]+)<.+>$/u.exec(typeValue);
  return match?.[1] ?? null;
}
