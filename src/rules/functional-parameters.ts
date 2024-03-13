import { type TSESTree } from "@typescript-eslint/utils";
import {
  type JSONSchema4,
  type JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  ignoreIdentifierPatternOptionSchema,
  ignorePrefixSelectorOptionSchema,
  shouldIgnorePattern,
  type IgnoreIdentifierPatternOption,
  type IgnorePrefixSelectorOption,
} from "#eslint-plugin-functional/options";
import { type ESFunction } from "#eslint-plugin-functional/utils/node-types";
import {
  createRuleUsingFunction,
  type NamedCreateRuleMetaWithCategory,
  type RuleResult,
} from "#eslint-plugin-functional/utils/rule";
import {
  isArgument,
  isGetter,
  isIIFE,
  isPropertyAccess,
  isPropertyName,
  isSetter,
} from "#eslint-plugin-functional/utils/tree";
import { isRestElement } from "#eslint-plugin-functional/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "functional-parameters" as const;

/**
 * The parameter count options this rule can take.
 */
type ParameterCountOptions = "atLeastOne" | "exactlyOne";

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreIdentifierPatternOption &
    IgnorePrefixSelectorOption & {
      allowRestParameter: boolean;
      allowArgumentsKeyword: boolean;
      enforceParameterCount:
        | ParameterCountOptions
        | false
        | {
            count: ParameterCountOptions;
            ignoreLambdaExpression: boolean;
            ignoreIIFE: boolean;
            ignoreGettersAndSetters: boolean;
          };
    },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(
      ignoreIdentifierPatternOptionSchema,
      ignorePrefixSelectorOptionSchema,
      {
        allowRestParameter: {
          type: "boolean",
        },
        allowArgumentsKeyword: {
          type: "boolean",
        },
        enforceParameterCount: {
          oneOf: [
            {
              type: "boolean",
              enum: [false],
            },
            {
              type: "string",
              enum: ["atLeastOne", "exactlyOne"],
            },
            {
              type: "object",
              properties: {
                count: {
                  type: "string",
                  enum: ["atLeastOne", "exactlyOne"],
                },
                ignoreGettersAndSetters: {
                  type: "boolean",
                },
                ignoreLambdaExpression: {
                  type: "boolean",
                },
                ignoreIIFE: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
          ],
        },
      } satisfies JSONSchema4ObjectSchema["properties"],
    ),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    allowRestParameter: false,
    allowArgumentsKeyword: false,
    enforceParameterCount: {
      count: "atLeastOne",
      ignoreLambdaExpression: false,
      ignoreIIFE: true,
      ignoreGettersAndSetters: true,
    },
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  restParam:
    "Unexpected rest parameter. Use a regular parameter of type array instead.",
  arguments:
    "Unexpected use of `arguments`. Use regular function arguments instead.",
  paramCountAtLeastOne: "Functions must have at least one parameter.",
  paramCountExactlyOne: "Functions must have exactly one parameter.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Currying",
    description: "Enforce functional parameters.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Get the rest parameter violations.
 */
function getRestParamViolations(
  [{ allowRestParameter }]: Readonly<Options>,
  node: ESFunction,
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  return !allowRestParameter &&
    node.params.length > 0 &&
    isRestElement(node.params.at(-1))
    ? [
        {
          node: node.params.at(-1),
          messageId: "restParam",
        },
      ]
    : [];
}

/**
 * Get the parameter count violations.
 */
function getParamCountViolations(
  [{ enforceParameterCount }]: Readonly<Options>,
  node: ESFunction,
): RuleResult<keyof typeof errorMessages, Options>["descriptors"] {
  if (
    enforceParameterCount === false ||
    (node.params.length === 0 &&
      typeof enforceParameterCount === "object" &&
      ((enforceParameterCount.ignoreIIFE && isIIFE(node)) ||
        (enforceParameterCount.ignoreLambdaExpression && isArgument(node)) ||
        (enforceParameterCount.ignoreGettersAndSetters &&
          (isGetter(node) || isSetter(node)))))
  ) {
    return [];
  }
  if (
    node.params.length === 0 &&
    (enforceParameterCount === "atLeastOne" ||
      (typeof enforceParameterCount === "object" &&
        enforceParameterCount.count === "atLeastOne"))
  ) {
    return [
      {
        node,
        messageId: "paramCountAtLeastOne",
      },
    ];
  }
  if (
    node.params.length !== 1 &&
    (enforceParameterCount === "exactlyOne" ||
      (typeof enforceParameterCount === "object" &&
        enforceParameterCount.count === "exactlyOne"))
  ) {
    return [
      {
        node,
        messageId: "paramCountExactlyOne",
      },
    ];
  }
  return [];
}

/**
 * Check if the given function node has a reset parameter this rule.
 */
function checkFunction(
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreIdentifierPattern } = optionsObject;

  if (shouldIgnorePattern(node, context, ignoreIdentifierPattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: [
      ...getRestParamViolations(options, node),
      ...getParamCountViolations(options, node),
    ],
  };
}

/**
 * Check if the given identifier is for the "arguments" keyword.
 */
function checkIdentifier(
  node: TSESTree.Identifier,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreIdentifierPattern } = optionsObject;

  if (shouldIgnorePattern(node, context, ignoreIdentifierPattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  const { allowArgumentsKeyword } = optionsObject;

  return {
    context,
    descriptors:
      !allowArgumentsKeyword &&
      node.name === "arguments" &&
      !isPropertyName(node) &&
      !isPropertyAccess(node)
        ? [
            {
              node,
              messageId: "arguments",
            },
          ]
        : [],
  };
}

// Create the rule.
export const rule = createRuleUsingFunction<
  keyof typeof errorMessages,
  Options
>(name, meta, defaultOptions, (context, options) => {
  const [optionsObject] = options;
  const { ignorePrefixSelector } = optionsObject;

  const baseFunctionSelectors = [
    "ArrowFunctionExpression",
    "FunctionDeclaration",
    "FunctionExpression",
  ];

  const ignoreSelectors =
    ignorePrefixSelector === undefined
      ? undefined
      : Array.isArray(ignorePrefixSelector)
        ? ignorePrefixSelector
        : [ignorePrefixSelector];

  const fullFunctionSelectors = baseFunctionSelectors.flatMap((baseSelector) =>
    ignoreSelectors === undefined
      ? [baseSelector]
      : `:not(:matches(${ignoreSelectors.join(",")})) > ${baseSelector}`,
  );

  return {
    ...Object.fromEntries(
      fullFunctionSelectors.map((selector) => [selector, checkFunction]),
    ),
    Identifier: checkIdentifier,
  };
});
