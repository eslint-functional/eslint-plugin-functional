// Polyfill.
import "array.prototype.flatmap/auto.js";

import { TSESTree } from "@typescript-eslint/typescript-estree";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
  checkNode,
  createRule,
  getTypeOfNode,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";
import { isInReturnType } from "../util/tree";
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
type Options = readonly [
  ignore.IgnoreLocalOption &
    ignore.IgnorePatternOption &
    ignore.IgnoreReturnTypeOption & {
      readonly allowImplicit: boolean;
    }
];

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignorePatternOptionSchema,
    ignore.ignoreReturnTypeOptionSchema,
    {
      type: "object",
      properties: {
        allowImplicit: {
          type: "boolean"
        }
      },
      additionalProperties: false
    }
  ])
];

// The default options for the rule.
const defaultOptions: Options = [
  {
    ignoreLocal: false,
    ignoreReturnType: false,
    allowImplicit: false
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
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      (!node.parent ||
        !isTSTypeOperator(node.parent) ||
        node.parent.operator !== "readonly") &&
      (!options.ignoreReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: "generic",
              fix:
                node.parent && isTSArrayType(node.parent)
                  ? fixer => [
                      fixer.insertTextBefore(node, "(readonly "),
                      fixer.insertTextAfter(node, ")")
                    ]
                  : fixer => fixer.insertTextBefore(node, "readonly ")
            }
          ]
        : []
  };
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkTypeReference(
  node: TSESTree.TSTypeReference,
  context: RuleContext<keyof typeof errorMessages, Options>,
  [options]: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      isIdentifier(node.typeName) &&
      node.typeName.name === "Array" &&
      (!options.ignoreReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: "generic",
              fix: fixer => fixer.insertTextBefore(node, "Readonly")
            }
          ]
        : []
  };
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
): RuleResult<keyof typeof errorMessages, Options> {
  type Declarator = {
    readonly id: TSESTree.Node;
    readonly init: TSESTree.Node | null;
    readonly node: TSESTree.Node;
  };

  const declarators: ReadonlyArray<Declarator> = isFunctionLike(node)
    ? node.params
        .map(param =>
          isAssignmentPattern(param)
            ? /* eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion */
              ({ id: param.left, init: param.right, node: param } as Declarator)
            : undefined
        )
        .filter((param): param is Declarator => param !== undefined)
    : node.declarations.map(
        declaration =>
          /* eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion */
          ({
            id: declaration.id,
            init: declaration.init,
            node: declaration
          } as Declarator)
      );

  return {
    context,
    descriptors: declarators.flatMap(declarator => {
      return isIdentifier(declarator.id) &&
        declarator.id.typeAnnotation === undefined &&
        declarator.init !== null &&
        isArrayType(getTypeOfNode(declarator.init, context))
        ? [
            {
              node: declarator.node,
              messageId: "implicit",
              fix: fixer =>
                fixer.insertTextAfter(declarator.id, ": readonly unknown[]")
            }
          ]
        : [];
    })
  };
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
      ...(ignoreOptions.allowImplicit
        ? {}
        : {
            VariableDeclaration: _checkImplicitType,
            FunctionDeclaration: _checkImplicitType,
            FunctionExpression: _checkImplicitType,
            ArrowFunctionExpression: _checkImplicitType
          })
    };
  }
});
