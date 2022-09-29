import type { ESLintUtils, TSESLint } from "@typescript-eslint/utils";
import { Immutability } from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { ESFunctionType } from "~/util/node-types";
import type { RuleResult } from "~/util/rule";
import { getTypeImmutabilityOfNode, createRule } from "~/util/rule";
import { isDefined, isTSParameterProperty } from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "prefer-immutable-parameter-types" as const;

/**
 * The options this rule can take.
 */
type Options = ReadonlyDeep<
  [
    {
      enforcement: Exclude<
        Immutability | keyof typeof Immutability,
        "Unknown" | "Mutable"
      >;
      ignoreInferredTypes: boolean;
    }
  ]
>;

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: {
      enforcement: {
        type: ["string", "number"],
        enum: Object.values(Immutability).filter(
          (i) =>
            i !== Immutability.Unknown &&
            i !== Immutability[Immutability.Unknown] &&
            i !== Immutability.Mutable &&
            i !== Immutability[Immutability.Mutable]
        ),
      },
      ignoreInferredTypes: {
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
    enforcement: Immutability.Immutable,
    ignoreInferredTypes: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic:
    'Parameter should have an immutability at least "{{ expected }}" (actual: "{{ actual }}").',
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
  const { enforcement: rawEnforcement, ignoreInferredTypes } = optionsObject;

  const enforcement =
    typeof rawEnforcement === "string"
      ? Immutability[rawEnforcement]
      : rawEnforcement;

  type Descriptor = RuleResult<
    keyof typeof errorMessages,
    Options
  >["descriptors"][number];

  const descriptors = node.params
    .map((param): Descriptor | undefined => {
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
            messageId: "generic",
            data: {
              actual: Immutability[immutability],
              expected: Immutability[enforcement],
            },
          };
    })
    .filter(isDefined);

  return {
    context,
    descriptors,
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
  }
);
