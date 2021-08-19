import type { TSESTree } from "@typescript-eslint/experimental-utils";
import { all as deepMerge } from "deepmerge";
import type { JSONSchema4 } from "json-schema";

import type {
  AllowLocalMutationOption,
  IgnoreClassOption,
  IgnoreInterfaceOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  shouldIgnoreLocalMutation,
  shouldIgnoreClass,
  shouldIgnoreInterface,
  shouldIgnorePattern,
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignoreInterfaceOptionSchema,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import type { RuleContext, RuleMetaData, RuleResult } from "~/util/rule";
import { createRule, getTypeOfNode } from "~/util/rule";
import { isInReturnType } from "~/util/tree";
import {
  isArrayType,
  isAssignmentPattern,
  isFunctionLike,
  isIdentifier,
  isTSArrayType,
  isTSIndexSignature,
  isTSParameterProperty,
  isTSPropertySignature,
  isTSTupleType,
  isTSTypeOperator,
} from "~/util/typeguard";

// The name of this rule.
export const name = "prefer-readonly-type" as const;

// The options this rule can take.
type Options = AllowLocalMutationOption &
  IgnoreClassOption &
  IgnoreInterfaceOption &
  IgnorePatternOption & {
    readonly allowMutableReturnType: boolean;
    readonly checkImplicit: boolean;
    readonly ignoreCollections: boolean;
  };

// The schema for the rule options.
const schema: JSONSchema4 = [
  deepMerge([
    allowLocalMutationOptionSchema,
    ignorePatternOptionSchema,
    ignoreClassOptionSchema,
    ignoreInterfaceOptionSchema,
    {
      type: "object",
      properties: {
        allowMutableReturnType: {
          type: "boolean",
        },
        checkImplicit: {
          type: "boolean",
        },
        ignoreCollections: {
          type: "boolean",
        },
      },
      additionalProperties: false,
    },
  ]),
];

// The default options for the rule.
const defaultOptions: Options = {
  checkImplicit: false,
  ignoreClass: false,
  ignoreInterface: false,
  ignoreCollections: false,
  allowLocalMutation: false,
  allowMutableReturnType: false,
};

// The possible error messages.
const errorMessages = {
  array: "Only readonly arrays allowed.",
  implicit: "Implicitly a mutable array. Only readonly arrays allowed.",
  property: "A readonly modifier is required.",
  tuple: "Only readonly tuples allowed.",
  type: "Only readonly types allowed.",
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Prefer readonly array over mutable arrays.",
    category: "Best Practices",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

const mutableToImmutableTypes: ReadonlyMap<string, string> = new Map<
  string,
  string
>([
  ["Array", "ReadonlyArray"],
  ["Map", "ReadonlyMap"],
  ["Set", "ReadonlySet"],
]);
const mutableTypeRegex = new RegExp(
  `^${[...mutableToImmutableTypes.keys()].join("|")}$`,
  "u"
);

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: TSESTree.TSArrayType | TSESTree.TSTupleType,
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  if (options.ignoreCollections) {
    return {
      context,
      descriptors: [],
    };
  }
  return {
    context,
    descriptors:
      (node.parent === undefined ||
        !isTSTypeOperator(node.parent) ||
        node.parent.operator !== "readonly") &&
      (!options.allowMutableReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: isTSTupleType(node) ? "tuple" : "array",
              fix:
                node.parent !== undefined && isTSArrayType(node.parent)
                  ? (fixer) => [
                      fixer.insertTextBefore(node, "(readonly "),
                      fixer.insertTextAfter(node, ")"),
                    ]
                  : (fixer) => fixer.insertTextBefore(node, "readonly "),
            },
          ]
        : [],
  };
}

/**
 * Check if the given TSMappedType violates this rule.
 */
function checkMappedType(
  node: TSESTree.TSMappedType,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      node.readonly === true || node.readonly === "+"
        ? []
        : [
            {
              node,
              messageId: "property",
              fix: (fixer) =>
                fixer.insertTextBeforeRange(
                  [node.range[0] + 1, node.range[1]],
                  " readonly"
                ),
            },
          ],
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
    if (
      options.ignoreCollections &&
      mutableTypeRegex.test(node.typeName.name)
    ) {
      return {
        context,
        descriptors: [],
      };
    }
    const immutableType = mutableToImmutableTypes.get(node.typeName.name);
    return {
      context,
      descriptors:
        immutableType !== undefined &&
        immutableType.length > 0 &&
        (!options.allowMutableReturnType || !isInReturnType(node))
          ? [
              {
                node,
                messageId: "type",
                fix: (fixer) => fixer.replaceText(node.typeName, immutableType),
              },
            ]
          : [],
    };
  }
  return {
    context,
    descriptors: [],
  };
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
  context: RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  return {
    context,
    descriptors:
      node.readonly !== true &&
      (!options.allowMutableReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: "property",
              fix:
                isTSIndexSignature(node) || isTSPropertySignature(node)
                  ? (fixer) => fixer.insertTextBefore(node, "readonly ")
                  : isTSParameterProperty(node)
                  ? (fixer) =>
                      fixer.insertTextBefore(node.parameter, "readonly ")
                  : (fixer) => fixer.insertTextBefore(node.key, "readonly "),
            },
          ]
        : [],
  };
}

/**
 * Check if the given TypeReference violates this rule.
 */
function checkImplicitType(
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.VariableDeclaration,
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
          .map((param) =>
            isAssignmentPattern(param)
              ? ({
                  id: param.left,
                  init: param.right,
                  node: param,
                } as Declarator)
              : undefined
          )
          .filter((param): param is Declarator => param !== undefined)
      : node.declarations.map(
          (declaration) =>
            ({
              id: declaration.id,
              init: declaration.init,
              node: declaration,
            } as Declarator)
        );

    return {
      context,
      descriptors: declarators.flatMap((declarator) =>
        isIdentifier(declarator.id) &&
        declarator.id.typeAnnotation === undefined &&
        declarator.init !== null &&
        isArrayType(getTypeOfNode(declarator.init, context)) &&
        !options.ignoreCollections
          ? [
              {
                node: declarator.node,
                messageId: "implicit",
                fix: (fixer) =>
                  fixer.insertTextAfter(declarator.id, ": readonly unknown[]"),
              },
            ]
          : []
      ),
    };
  }
  return {
    context,
    descriptors: [],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ArrowFunctionExpression: checkImplicitType,
    ClassProperty: checkProperty,
    FunctionDeclaration: checkImplicitType,
    FunctionExpression: checkImplicitType,
    TSArrayType: checkArrayOrTupleType,
    TSIndexSignature: checkProperty,
    TSParameterProperty: checkProperty,
    TSPropertySignature: checkProperty,
    TSTupleType: checkArrayOrTupleType,
    TSMappedType: checkMappedType,
    TSTypeReference: checkTypeReference,
    VariableDeclaration: checkImplicitType,
  },
  [
    shouldIgnoreClass,
    shouldIgnoreInterface,
    shouldIgnoreLocalMutation,
    shouldIgnorePattern,
  ]
);
