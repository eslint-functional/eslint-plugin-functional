import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "json-schema";

import type {
  IgnorePatternOption,
  IgnoreAccessorPatternOption,
} from "~/options";
import {
  shouldIgnoreInFunction,
  shouldIgnoreClasses,
  shouldIgnorePattern,
} from "~/options";
import type { ESArrayTupleType } from "~/utils/node-types";
import type {
  BaseOptions,
  RuleResult,
  NamedCreateRuleMetaWithCategory,
} from "~/utils/rule";
import { createRule, getTypeOfNode } from "~/utils/rule";
import { inInterface, isInReturnType } from "~/utils/tree";
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
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSTypeOperator,
  isTSTypeReference,
} from "~/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "prefer-readonly-type" as const;

/**
 * The options this rule can take.
 */
type Options = [
  {
    allowLocalMutation: boolean;
    allowMutableReturnType: boolean;
    checkImplicit: boolean;
    ignoreCollections: boolean;
    ignoreClass: boolean | "fieldsOnly";
    ignoreInterface: boolean;
    ignorePattern?: string[] | string;
  }
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      allowLocalMutation: {
        type: "boolean",
      },
      ignorePattern: {
        type: ["string", "array"],
        items: {
          type: "string",
        },
      },
      ignoreClass: {
        oneOf: [
          {
            type: "boolean",
          },
          {
            type: "string",
            enum: ["fieldsOnly"],
          },
        ],
      },
      ignoreInterface: {
        type: "boolean",
      },
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
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  deprecated: true,
  replacedBy: [
    "functional/prefer-immutable-types",
    "functional/type-declaration-immutability",
  ],
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Prefer readonly types over mutable types.",
    recommended: "error",
  },
  messages: errorMessages,
  fixable: "code",
  schema,
};

const mutableToImmutableTypes = new Map<string, string>([
  ["Array", "ReadonlyArray"],
  ["Map", "ReadonlyMap"],
  ["Set", "ReadonlySet"],
]);
const mutableTypeRegex = new RegExp(
  `^${[...mutableToImmutableTypes.keys()].join("|")}$`,
  "u"
);

function shouldIgnorePattern2(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<string, BaseOptions>,
  ignorePattern: Partial<IgnorePatternOption>["ignorePattern"],
  ignoreAccessorPattern?: Partial<IgnoreAccessorPatternOption>["ignoreAccessorPattern"]
): boolean {
  const isTypeNode =
    isTSArrayType(node) ||
    isTSIndexSignature(node) ||
    isTSTupleType(node) ||
    isTSTypeAnnotation(node) ||
    isTSTypeLiteral(node) ||
    isTSTypeReference(node);

  if (isTypeNode) {
    return shouldIgnorePattern2(
      node.parent!,
      context,
      ignorePattern,
      ignoreAccessorPattern
    );
  }

  return shouldIgnorePattern(
    node,
    context,
    ignorePattern,
    ignoreAccessorPattern
  );
}

/**
 * Check if the given ArrayType or TupleType violates this rule.
 */
function checkArrayOrTupleType(
  node: ESArrayTupleType,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    allowLocalMutation,
    allowMutableReturnType,
    ignoreClass,
    ignoreCollections,
    ignoreInterface,
    ignorePattern,
  } = optionsObject;

  if (
    shouldIgnoreClasses(node, context, ignoreClass) ||
    (ignoreInterface === true && inInterface(node)) ||
    shouldIgnoreInFunction(node, context, allowLocalMutation) ||
    shouldIgnorePattern2(node, context, ignorePattern) ||
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
  node: TSESTree.TSMappedType,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { allowLocalMutation, ignoreClass, ignoreInterface, ignorePattern } =
    optionsObject;

  if (
    shouldIgnoreClasses(node, context, ignoreClass) ||
    (ignoreInterface === true && inInterface(node)) ||
    shouldIgnoreInFunction(node, context, allowLocalMutation) ||
    shouldIgnorePattern2(node, context, ignorePattern)
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
  node: TSESTree.TSTypeReference,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    allowLocalMutation,
    ignoreClass,
    ignoreInterface,
    ignorePattern,
    allowMutableReturnType,
    ignoreCollections,
  } = optionsObject;

  if (
    shouldIgnoreClasses(node, context, ignoreClass) ||
    (ignoreInterface === true && inInterface(node)) ||
    shouldIgnoreInFunction(node, context, allowLocalMutation) ||
    shouldIgnorePattern2(node, context, ignorePattern)
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
    | TSESTree.PropertyDefinition
    | TSESTree.TSIndexSignature
    | TSESTree.TSParameterProperty
    | TSESTree.TSPropertySignature,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    allowLocalMutation,
    ignoreClass,
    ignoreInterface,
    ignorePattern,
    allowMutableReturnType,
  } = optionsObject;

  if (
    shouldIgnoreClasses(node, context, ignoreClass) ||
    (ignoreInterface === true && inInterface(node)) ||
    shouldIgnoreInFunction(node, context, allowLocalMutation) ||
    shouldIgnorePattern2(node, context, ignorePattern)
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
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | TSESTree.VariableDeclaration,
  context: TSESLint.RuleContext<keyof typeof errorMessages, Options>,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const {
    allowLocalMutation,
    ignoreClass,
    ignoreInterface,
    ignorePattern,
    checkImplicit,
    ignoreCollections,
  } = optionsObject;

  if (
    !checkImplicit ||
    shouldIgnoreClasses(node, context, ignoreClass) ||
    (ignoreInterface === true && inInterface(node)) ||
    shouldIgnoreInFunction(node, context, allowLocalMutation) ||
    shouldIgnorePattern2(node, context, ignorePattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  type Declarator = {
    id: TSESTree.Node;
    init: TSESTree.Node | null;
    node: TSESTree.Node;
  };

  const declarators: Declarator[] = isFunctionLike(node)
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
