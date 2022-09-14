import type { ESLintUtils, TSESLint } from "@typescript-eslint/utils";
import { Immutableness } from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { ESFunctionType } from "~/util/node-types";
import type { RuleResult } from "~/util/rule";
import { getTypeImmutablenessOfNode, createRule } from "~/util/rule";
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
        Immutableness | keyof typeof Immutableness,
        "Unknown" | "Mutable"
      >;
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
        enum: Object.values(Immutableness).filter(
          (i) =>
            i !== Immutableness.Unknown &&
            i !== Immutableness[Immutableness.Unknown] &&
            i !== Immutableness.Mutable &&
            i !== Immutableness[Immutableness.Mutable]
        ),
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
    enforcement: Immutableness.ReadonlyDeep,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic:
    'Parameter should have an immutableness at least "{{ expected }}" (actual: "{{ actual }}").',
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description:
      "Require function parameters to be typed as certain immutableness",
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
  const { enforcement: rawEnforcement } = optionsObject;

  const enforcement =
    typeof rawEnforcement === "string"
      ? Immutableness[rawEnforcement]
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
      const immutableness = getTypeImmutablenessOfNode(actualParam, context);

      return immutableness >= enforcement
        ? undefined
        : {
            node: actualParam,
            messageId: "generic",
            data: {
              actual: Immutableness[immutableness],
              expected: Immutableness[enforcement],
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
