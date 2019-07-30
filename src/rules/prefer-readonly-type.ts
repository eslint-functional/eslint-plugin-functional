// Polyfill.
import "array.prototype.flatmap/auto.js";

import { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import { JSONSchema4 } from "json-schema";

import * as ignore from "../common/ignore-options";
import {
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
  isTSIndexSignature,
  isTSParameterProperty,
  isTSTupleType,
  isTSTypeOperator
} from "../util/typeguard";

// The name of this rule.
export const name = "prefer-readonly-type" as const;

// The options this rule can take.
type Options = ignore.IgnoreLocalOption &
  ignore.IgnorePatternOption &
  ignore.IgnoreClassOption &
  ignore.IgnoreInterfaceOption &
  ignore.IgnoreReturnTypeOption & {
    readonly checkImplicit: boolean;
  };

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    ignore.ignoreLocalOptionSchema,
    ignore.ignorePatternOptionSchema,
    ignore.ignoreClassOptionSchema,
    ignore.ignoreInterfaceOptionSchema,
    ignore.ignoreReturnTypeOptionSchema,
    {
      type: "object",
      properties: {
        checkImplicit: {
          type: "boolean"
        }
      },
      additionalProperties: false
    }
  ])
];

// The default options for the rule.
const defaultOptions: Options = {
  checkImplicit: false,
  ignoreClass: false,
  ignoreInterface: false,
  ignoreLocal: false,
  ignoreReturnType: false
};

// The possible error messages.
const errorMessages = {
  array: "Only readonly arrays allowed.",
  implicit: "Implicitly a mutable array. Only readonly arrays allowed.",
  property: "A readonly modifier is required.",
  tuple: "Only readonly tuples allowed.",
  type: "Only readonly types allowed."
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

const mutableToImmutableTypes: ReadonlyMap<string, string> = new Map<
  string,
  string
>([["Array", "ReadonlyArray"], ["Map", "ReadonlyMap"], ["Set", "ReadonlySet"]]);

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
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
              messageId: isTSTupleType(node) ? "tuple" : "array",
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
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (isIdentifier(node.typeName)) {
    const immutableType = mutableToImmutableTypes.get(node.typeName.name);
    return {
      context,
      descriptors:
        immutableType && (!options.ignoreReturnType || !isInReturnType(node))
          ? [
              {
                node,
                messageId: "type",
                fix: fixer => fixer.replaceText(node.typeName, immutableType)
              }
            ]
          : []
    };
  } else {
    return {
      context,
      descriptors: []
    };
  }
}

/**
 * Check if the given property/signature node violates this rule.
 */
function checkProperty(
  node:
    | TSESTree.ClassProperty
    | TSESTree.TSIndexSignature
    | TSESTree.TSParameterProperty
    | TSESTree.TSPropertySignature,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors: node.readonly
      ? []
      : [
          {
            node,
            messageId: "property",
            fix: isTSIndexSignature(node)
              ? fixer => fixer.insertTextBefore(node, "readonly ")
              : isTSParameterProperty(node)
              ? fixer => fixer.insertTextBefore(node.parameter, "readonly ")
              : fixer => fixer.insertTextBefore(node.key, "readonly ")
          }
        ]
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
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (options.checkImplicit) {
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
                ({
                  id: param.left,
                  init: param.right,
                  node: param
                } as Declarator)
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
  } else {
    return {
      context,
      descriptors: []
    };
  }
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSArrayType: checkArrayOrTupleType,
    TSTupleType: checkArrayOrTupleType,
    TSTypeReference: checkTypeReference,
    ClassProperty: checkProperty,
    TSIndexSignature: checkProperty,
    TSParameterProperty: checkProperty,
    TSPropertySignature: checkProperty,
    VariableDeclaration: checkImplicitType,
    FunctionDeclaration: checkImplicitType,
    FunctionExpression: checkImplicitType,
    ArrowFunctionExpression: checkImplicitType
  }
);
