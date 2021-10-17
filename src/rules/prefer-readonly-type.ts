import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

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
import type { RuleResult } from "~/util/rule";
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

/**
 * The name of this rule.
 */
export const name = "prefer-readonly-type" as const;

/**
 * The options this rule can take.
 */
type Options = readonly [
  AllowLocalMutationOption &
    IgnoreClassOption &
    IgnoreInterfaceOption &
    IgnorePatternOption &
    Readonly<{
      allowMutableReturnType: boolean;
      checkImplicit: boolean;
      ignoreCollections: boolean;
    }>
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(
      allowLocalMutationOptionSchema,
      ignorePatternOptionSchema,
      ignoreClassOptionSchema,
      ignoreInterfaceOptionSchema,
      {
        allowMutableReturnType: {
          type: "boolean",
        },
        checkImplicit: {
          type: "boolean",
        },
        ignoreCollections: {
          type: "boolean",
        },
      }
    ),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    checkImplicit: false,
    ignoreClass: false,
    ignoreInterface: false,
    ignoreCollections: false,
    allowLocalMutation: false,
    allowMutableReturnType: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  array: "Only readonly arrays allowed.",
  implicit: "Implicitly a mutable array. Only readonly arrays allowed.",
  property: "A readonly modifier is required.",
  tuple: "Only readonly tuples allowed.",
  type: "Only readonly types allowed.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  deprecated: true,
  replacedBy: [
    "prefer-readonly-type-declaration",
    "@typescript-eslint/prefer-readonly-parameter-types",
  ],
  type: "suggestion",
  docs: {
    description: "Prefer readonly array over mutable arrays.",
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
  node: ReadonlyDeep<TSESTree.TSArrayType> | ReadonlyDeep<TSESTree.TSTupleType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { allowMutableReturnType, ignoreCollections } = optionsObject;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject) ||
    ignoreCollections
  ) {
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
      (!allowMutableReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: isTSTupleType(node) ? "tuple" : "array",
              fix:
                node.parent !== undefined && isTSArrayType(node.parent)
                  ? (fixer) => [
                      fixer.insertTextBefore(
                        node as TSESTree.Node,
                        "(readonly "
                      ),
                      fixer.insertTextAfter(node as TSESTree.Node, ")"),
                    ]
                  : (fixer) =>
                      fixer.insertTextBefore(
                        node as TSESTree.Node,
                        "readonly "
                      ),
            },
          ]
        : [],
  };
}

/**
 * Check if the given TSMappedType violates this rule.
 */
function checkMappedType(
  node: ReadonlyDeep<TSESTree.TSMappedType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

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
  node: ReadonlyDeep<TSESTree.TSTypeReference>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { allowMutableReturnType, ignoreCollections } = optionsObject;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  if (isIdentifier(node.typeName)) {
    if (ignoreCollections && mutableTypeRegex.test(node.typeName.name)) {
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
        (!allowMutableReturnType || !isInReturnType(node))
          ? [
              {
                node,
                messageId: "type",
                fix: (fixer) =>
                  fixer.replaceText(
                    node.typeName as TSESTree.Node,
                    immutableType
                  ),
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
    | ReadonlyDeep<TSESTree.PropertyDefinition>
    | ReadonlyDeep<TSESTree.TSIndexSignature>
    | ReadonlyDeep<TSESTree.TSParameterProperty>
    | ReadonlyDeep<TSESTree.TSPropertySignature>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { allowMutableReturnType } = optionsObject;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors:
      node.readonly !== true &&
      (!allowMutableReturnType || !isInReturnType(node))
        ? [
            {
              node,
              messageId: "property",
              fix:
                isTSIndexSignature(node) || isTSPropertySignature(node)
                  ? (fixer) =>
                      fixer.insertTextBefore(node as TSESTree.Node, "readonly ")
                  : isTSParameterProperty(node)
                  ? (fixer) =>
                      fixer.insertTextBefore(
                        node.parameter as TSESTree.Node,
                        "readonly "
                      )
                  : (fixer) =>
                      fixer.insertTextBefore(
                        node.key as TSESTree.Node,
                        "readonly "
                      ),
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
    | ReadonlyDeep<TSESTree.ArrowFunctionExpression>
    | ReadonlyDeep<TSESTree.FunctionDeclaration>
    | ReadonlyDeep<TSESTree.FunctionExpression>
    | ReadonlyDeep<TSESTree.VariableDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { checkImplicit, ignoreCollections } = optionsObject;

  if (
    !checkImplicit ||
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreInterface(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

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
      !ignoreCollections
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

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ArrowFunctionExpression: checkImplicitType,
    PropertyDefinition: checkProperty,
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
  }
);
