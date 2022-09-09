import type { TSESTree } from "@typescript-eslint/utils";

export type ESFunction =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression;

export type ESFunctionType = ESFunction | TSESTree.TSFunctionType;

export type ESClass = TSESTree.ClassDeclaration | TSESTree.ClassExpression;

export type ESLoop =
  | TSESTree.DoWhileStatement
  | TSESTree.ForInStatement
  | TSESTree.ForOfStatement
  | TSESTree.ForStatement
  | TSESTree.WhileStatement;

export type ESArrayTupleType = TSESTree.TSArrayType | TSESTree.TSTupleType;
