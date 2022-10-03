import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import { Immutability } from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type {
  AllowLocalMutationOption,
  IgnoreClassOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignorePatternOptionSchema,
  shouldIgnoreClass,
  shouldIgnoreLocalMutation,
  shouldIgnorePattern,
} from "~/common/ignore-options";
import type { ESFunctionType } from "~/util/node-types";
import type { RuleResult } from "~/util/rule";
import {
  getReturnTypesOfFunction,
  getTypeImmutabilityOfNode,
  getTypeImmutabilityOfType,
  createRule,
} from "~/util/rule";
import {
  hasID,
  isDefined,
  isPropertyDefinition,
  isTSParameterProperty,
} from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "prefer-immutable-types" as const;

type RawEnforcement =
  | Exclude<Immutability | keyof typeof Immutability, "Unknown" | "Mutable">
  | "None"
  | false;

type Option = ReadonlyDeep<
  AllowLocalMutationOption &
    IgnoreClassOption &
    IgnorePatternOption & {
      enforcement: RawEnforcement;
      ignoreInferredTypes: boolean;
    }
>;

/**
 * The options this rule can take.
 */
type Options = ReadonlyDeep<
  [
    Option & {
      parameters?: Option | RawEnforcement;
      returnTypes?: Option | RawEnforcement;
      variables?: Option | RawEnforcement;
    }
  ]
>;

/**
 * The enum options for the level of enforcement.
 */
const enforcementEnumOptions = [
  ...Object.values(Immutability).filter(
    (i) =>
      i !== Immutability.Unknown &&
      i !== Immutability[Immutability.Unknown] &&
      i !== Immutability.Mutable &&
      i !== Immutability[Immutability.Mutable]
  ),
  "None",
  false,
];

/**
 * The non-shorthand schema for each option.
 */
const optionExpandedSchema: JSONSchema4 = deepmerge(
  allowLocalMutationOptionSchema,
  ignoreClassOptionSchema,
  ignorePatternOptionSchema,
  {
    enforcement: {
      type: ["string", "number", "boolean"],
      enum: enforcementEnumOptions,
    },
    ignoreInferredTypes: {
      type: "boolean",
    },
  }
);

/**
 * The schema for each option.
 */
const optionSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "object",
      properties: optionExpandedSchema,
      additionalProperties: false,
    },
    {
      type: ["string", "number", "boolean"],
      enum: enforcementEnumOptions,
    },
  ],
};

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(optionExpandedSchema, {
      parameters: optionSchema,
      returnTypes: optionSchema,
      variables: optionSchema,
    }),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    enforcement: Immutability.Immutable,
    allowLocalMutation: false,
    ignoreInferredTypes: false,
    ignoreClass: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  parameter:
    'Parameter should have an immutability at least "{{ expected }}" (actual: "{{ actual }}").',
  returnType:
    'Return type should have an immutability at least "{{ expected }}" (actual: "{{ actual }}").',
  variable:
    'Variable should have an immutability at least "{{ expected }}" (actual: "{{ actual }}").',
  propertyImmutability:
    'Property should have an immutability at least "{{ expected }}" (actual: "{{ actual }}").',
  propertyModifier: "Property should have a readonly modifier.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Require function parameters to be typed as certain immutability",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

type Descriptor = RuleResult<
  keyof typeof errorMessages,
  Options
>["descriptors"][number];

/**
 * Get the level of enforcement from the raw value given.
 */
function parseEnforcement(rawEnforcement: RawEnforcement) {
  return rawEnforcement === "None"
    ? false
    : typeof rawEnforcement === "string"
    ? Immutability[rawEnforcement]
    : rawEnforcement;
}

/**
 * Get the parameter type violations.
 */
function getParameterTypeViolations(
  node: ReadonlyDeep<ESFunctionType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): Descriptor[] {
  const [optionsObject] = options;
  const { parameters: rawOption } = optionsObject;
  const { enforcement: rawEnforcement, ignoreInferredTypes } =
    typeof rawOption === "object"
      ? rawOption
      : {
          enforcement: rawOption,
          ignoreInferredTypes: defaultOptions[0].ignoreInferredTypes,
        };

  const enforcement = parseEnforcement(
    rawEnforcement ?? defaultOptions[0].enforcement
  );
  if (enforcement === false) {
    return [];
  }

  return node.params
    .map((param): Descriptor | undefined => {
      if (isTSParameterProperty(param) && param.readonly !== true) {
        return {
          node: param,
          messageId: "propertyModifier",
        };
      }

      const actualParam = isTSParameterProperty(param)
        ? param.parameter
        : param;

      if (ignoreInferredTypes && actualParam.typeAnnotation === undefined) {
        return undefined;
      }

      const immutability = getTypeImmutabilityOfNode(actualParam, context);

      return immutability >= enforcement
        ? undefined
        : {
            node: actualParam,
            messageId: "parameter",
            data: {
              actual: Immutability[immutability],
              expected: Immutability[enforcement],
            },
          };
    })
    .filter(isDefined);
}

/**
 * Get the return type violations.
 */
function getReturnTypeViolations(
  node: ReadonlyDeep<ESFunctionType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): Descriptor[] {
  const [optionsObject] = options;
  const { returnTypes: rawOption } = optionsObject;
  const { enforcement: rawEnforcement, ignoreInferredTypes } =
    typeof rawOption === "object"
      ? rawOption
      : {
          enforcement: rawOption,
          ignoreInferredTypes: defaultOptions[0].ignoreInferredTypes,
        };

  const enforcement = parseEnforcement(
    rawEnforcement ?? defaultOptions[0].enforcement
  );
  if (enforcement === false) {
    return [];
  }

  if (ignoreInferredTypes && node.returnType?.typeAnnotation === undefined) {
    return [];
  }

  if (node.returnType?.typeAnnotation !== undefined) {
    const immutability = getTypeImmutabilityOfNode(
      node.returnType.typeAnnotation,
      context
    );

    return immutability >= enforcement
      ? []
      : [
          {
            node: node.returnType,
            messageId: "returnType",
            data: {
              actual: Immutability[immutability],
              expected: Immutability[enforcement],
            },
          },
        ];
  }

  const returnTypes = getReturnTypesOfFunction(node, context);
  if (returnTypes === null) {
    return [];
  }

  const immutabilities = returnTypes.map((returnType) =>
    getTypeImmutabilityOfType(returnType, context)
  );

  const immutability = Math.min(...immutabilities);

  if (immutability >= enforcement) {
    return [];
  }

  return [
    {
      node: hasID(node) && node.id !== null ? node.id : node,
      messageId: "returnType",
      data: {
        actual: Immutability[immutability],
        expected: Immutability[enforcement],
      },
    },
  ];
}

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node: ReadonlyDeep<ESFunctionType>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const descriptors = [
    ...getParameterTypeViolations(node, context, options),
    ...getReturnTypeViolations(node, context, options),
  ];

  return {
    context,
    descriptors,
  };
}

/**
 * Check if the given function node violates this rule.
 */
function checkVarible(
  node: ReadonlyDeep<TSESTree.VariableDeclarator | TSESTree.PropertyDefinition>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;

  if (
    shouldIgnoreClass(node, context, optionsObject) ||
    shouldIgnoreLocalMutation(node, context, optionsObject) ||
    shouldIgnorePattern(node, context, optionsObject)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const isProperty = isPropertyDefinition(node);

  if (isProperty && node.readonly !== true) {
    return {
      context,
      descriptors: [
        {
          node,
          messageId: "propertyModifier",
        },
      ],
    };
  }

  const { variables: rawOption } = optionsObject;
  const { enforcement: rawEnforcement, ignoreInferredTypes } =
    typeof rawOption === "object"
      ? rawOption
      : {
          enforcement: rawOption,
          ignoreInferredTypes: defaultOptions[0].ignoreInferredTypes,
        };

  const enforcement = parseEnforcement(
    rawEnforcement ?? defaultOptions[0].enforcement
  );
  if (enforcement === false) {
    return {
      context,
      descriptors: [],
    };
  }

  const nodeWithTypeAnnotation = isProperty ? node : node.id;

  if (
    ignoreInferredTypes &&
    nodeWithTypeAnnotation.typeAnnotation === undefined
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const immutability = getTypeImmutabilityOfNode(
    nodeWithTypeAnnotation,
    context
  );

  return {
    context,
    descriptors:
      immutability >= enforcement
        ? []
        : [
            {
              node: nodeWithTypeAnnotation,
              messageId: isProperty ? "propertyImmutability" : "variable",
              data: {
                actual: Immutability[immutability],
                expected: Immutability[enforcement],
              },
            },
          ],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    ArrowFunctionExpression: checkFunction,
    FunctionDeclaration: checkFunction,
    FunctionExpression: checkFunction,
    TSCallSignatureDeclaration: checkFunction,
    TSConstructSignatureDeclaration: checkFunction,
    TSDeclareFunction: checkFunction,
    TSEmptyBodyFunctionExpression: checkFunction,
    TSFunctionType: checkFunction,
    TSMethodSignature: checkFunction,
    PropertyDefinition: checkVarible,
    VariableDeclarator: checkVarible,
  }
);
