import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  getParserServices,
  RuleContext,
  RuleMetaData
} from "../util/rule";
import {
  isArrayType,
  isAssignmentPattern,
  isFunctionLike,
  isIdentifier,
  isTSArrayType,
  isTSTypeOperator
} from "../util/typeguard";

// The name of this rule.
export const name = "readonly-array" as const;

// The options this rule can take.
type Options = [
  ignore.IgnoreLocalOption &
    ignore.IgnorePatternOptions &
    ignore.IgnoreReturnTypeOption
];

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignorePatternOptionsSchema,
    ignore.ignoreReturnTypeOptionSchema
  ])
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreLocal: false,
    ignoreReturnType: false
  }
];

// The possible error messages.
const errorMessages = {
  generic: "Only readonly arrays allowed.",
  implicit: "Implicitly a mutable array. Only readonly arrays allowed."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly array over mutable arrays.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  fixable: "code",
  schema
};

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): void {
  if (
    !node.parent ||
    !isTSTypeOperator(node.parent) ||
    node.parent.operator !== "readonly"
  ) {
    if (options.ignoreReturnType && isInReturnType(node)) {
      return;
    }

    context.report({
      node,
      messageId: "generic",
      fix: fixer =>
        node.parent && isTSArrayType(node.parent)
          ? [
              fixer.insertTextBefore(node, "(readonly "),
              fixer.insertTextAfter(node, ")")
            ]
          : fixer.insertTextBefore(node, "readonly ")
    });
  }
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkTypeReference(
  node: TSESTree.TSTypeReference,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): void {
  if (isIdentifier(node.typeName) && node.typeName.name === "Array") {
    if (options.ignoreReturnType && isInReturnType(node)) {
      return;
    }

    context.report({
      node,
      messageId: "generic",
      fix: fixer => fixer.insertTextBefore(node, "Readonly")
    });
  }
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkImplicitType(
  node:
    | TSESTree.VariableDeclaration
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): void {
  type Declarator = {
    id: TSESTree.Node;
    init: TSESTree.Node | null;
    node: TSESTree.Node;
  };

  const declarators: ReadonlyArray<Declarator> = isFunctionLike(node)
    ? node.params
        .map(param =>
          isAssignmentPattern(param)
            ? ({ id: param.left, init: param.right, node: param } as Declarator)
            : undefined
        )
        .filter((param): param is Declarator => param !== undefined)
    : node.declarations.map(
        declaration =>
          ({
            id: declaration.id,
            init: declaration.init,
            node: declaration
          } as Declarator)
      );

  declarators.forEach(declarator => {
    if (
      isIdentifier(declarator.id) &&
      declarator.id.typeAnnotation === undefined &&
      declarator.init !== null
    ) {
      const parserServices = getParserServices(context);
      const type = parserServices.program
        .getTypeChecker()
        .getTypeAtLocation(
          parserServices.esTreeNodeToTSNodeMap.get(declarator.init)
        );

      if (isArrayType(type)) {
        context.report({
          node: declarator.node,
          messageId: "implicit",
          fix: fixer =>
            fixer.insertTextAfter(declarator.id, ": readonly unknown[]")
        });
      }
    }
  });
}

/**
 * Is the given node in the return type.
 */
function isInReturnType(node: TSESTree.Node): boolean {
  let n: TSESTree.Node | undefined = node;
  while (n && n.parent) {
    if (isFunctionLike(n.parent)) {
      if (n.parent.returnType === n) {
        return true;
      }
      return false;
    }
    n = n.parent;
  }
  return false;
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context, [ignoreOptions, ...otherOptions]) {
    const _checkArrayOrTupleType = checkNode(
      checkArrayOrTupleType,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkTypeReference = checkNode(
      checkTypeReference,
      context,
      ignoreOptions,
      otherOptions
    );
    const _checkImplicitType = checkNode(
      checkImplicitType,
      context,
      ignoreOptions,
      otherOptions
    );

    return {
      TSArrayType: _checkArrayOrTupleType,
      TSTupleType: _checkArrayOrTupleType,
      TSTypeReference: _checkTypeReference,
      VariableDeclaration: _checkImplicitType,
      FunctionDeclaration: _checkImplicitType,
      FunctionExpression: _checkImplicitType,
      ArrowFunctionExpression: _checkImplicitType
    };
  }
});
