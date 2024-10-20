import type { TSESTree } from "@typescript-eslint/utils";

export type ESFunction = TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

export type ESFunctionType =
  | ESFunction
  | TSESTree.TSCallSignatureDeclaration
  | TSESTree.TSConstructSignatureDeclaration
  | TSESTree.TSDeclareFunction
  | TSESTree.TSEmptyBodyFunctionExpression
  | TSESTree.TSFunctionType
  | TSESTree.TSMethodSignature;

export type ESClass = TSESTree.ClassDeclaration | TSESTree.ClassExpression;

export type ESLoop =
  | TSESTree.DoWhileStatement
  | TSESTree.ForInStatement
  | TSESTree.ForOfStatement
  | TSESTree.ForStatement
  | TSESTree.WhileStatement;

export type ESArrayTupleType = TSESTree.TSArrayType | TSESTree.TSTupleType;

export type ESProperty =
  | TSESTree.PropertyDefinition
  | TSESTree.TSIndexSignature
  | TSESTree.TSParameterProperty
  | TSESTree.TSPropertySignature;

export type ESTypeDeclaration = TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration;
