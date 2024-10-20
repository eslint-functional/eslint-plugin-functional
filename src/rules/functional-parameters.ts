import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  type IgnoreIdentifierPatternOption,
  type IgnorePrefixSelectorOption,
  type OverridableOptions,
  type RawOverridableOptions,
  getCoreOptions,
  ignoreIdentifierPatternOptionSchema,
  ignorePrefixSelectorOptionSchema,
  shouldIgnorePattern,
  upgradeRawOverridableOptions,
} from "#/options";
import { ruleNameScope } from "#/utils/misc";
import type { ESFunction } from "#/utils/node-types";
import { type NamedCreateRuleCustomMeta, type Rule, type RuleResult, createRuleUsingFunction } from "#/utils/rule";
import { overridableOptionsSchema } from "#/utils/schemas";
import {
  getEnclosingFunction,
  isArgument,
  isGetter,
  isIIFE,
  isPropertyAccess,
  isPropertyName,
  isSetter,
} from "#/utils/tree";
import { isRestElement } from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "functional-parameters";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * The parameter count options this rule can take.
 */
type ParameterCountOptions = "atLeastOne" | "exactlyOne";

type CoreOptions = IgnoreIdentifierPatternOption &
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
  };

/**
 * The options this rule can take.
 */
type RawOptions = [RawOverridableOptions<CoreOptions>];
type Options = OverridableOptions<CoreOptions>;

const coreOptionsPropertiesSchema = deepmerge(ignoreIdentifierPatternOptionSchema, ignorePrefixSelectorOptionSchema, {
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
}) as NonNullable<JSONSchema4ObjectSchema["properties"]>;

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [overridableOptionsSchema(coreOptionsPropertiesSchema)];

/**
 * The default options for the rule.
 */
const defaultOptions = [
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
] satisfies RawOptions;

/**
 * The possible error messages.
 */
const errorMessages = {
  restParam: "Unexpected rest parameter. Use a regular parameter of type array instead.",
  arguments: "Unexpected use of `arguments`. Use regular function arguments instead.",
  paramCountAtLeastOne: "Functions must have at least one parameter.",
  paramCountExactlyOne: "Functions must have exactly one parameter.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "Currying",
    description: "Enforce functional parameters.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  messages: errorMessages,
  schema,
};

/**
 * Get the rest parameter violations.
 */
function getRestParamViolations(
  { allowRestParameter }: Readonly<CoreOptions>,
  node: ESFunction,
): RuleResult<keyof typeof errorMessages, RawOptions>["descriptors"] {
  return !allowRestParameter && node.params.length > 0 && isRestElement(node.params.at(-1))
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
  { enforceParameterCount }: Readonly<CoreOptions>,
  node: ESFunction,
): RuleResult<keyof typeof errorMessages, RawOptions>["descriptors"] {
  if (
    enforceParameterCount === false ||
    (node.params.length === 0 &&
      typeof enforceParameterCount === "object" &&
      ((enforceParameterCount.ignoreIIFE && isIIFE(node)) ||
        (enforceParameterCount.ignoreLambdaExpression && isArgument(node)) ||
        (enforceParameterCount.ignoreGettersAndSetters && (isGetter(node) || isSetter(node)))))
  ) {
    return [];
  }
  if (
    node.params.length === 0 &&
    (enforceParameterCount === "atLeastOne" ||
      (typeof enforceParameterCount === "object" && enforceParameterCount.count === "atLeastOne"))
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
      (typeof enforceParameterCount === "object" && enforceParameterCount.count === "exactlyOne"))
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
 * Add the default options to the given options.
 */
function getOptionsWithDefaults(options: Readonly<Options> | null): Options | null {
  if (options === null) {
    return null;
  }

  const topLevel = {
    ...defaultOptions[0],
    ...options,
  };
  return typeof topLevel.enforceParameterCount === "object"
    ? {
        ...topLevel,
        enforceParameterCount: {
          ...defaultOptions[0].enforceParameterCount,
          ...topLevel.enforceParameterCount,
        },
      }
    : topLevel;
}

/**
 * Check if the given function node has a reset parameter this rule.
 */
function checkFunction(
  node: ESFunction,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(node, context, options));

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern } = optionsToUse;

  if (shouldIgnorePattern(node, context, ignoreIdentifierPattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: [...getRestParamViolations(optionsToUse, node), ...getParamCountViolations(optionsToUse, node)],
  };
}

/**
 * Check if the given identifier is for the "arguments" keyword.
 */
function checkIdentifier(
  node: TSESTree.Identifier,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  if (node.name !== "arguments") {
    return {
      context,
      descriptors: [],
    };
  }

  const functionNode = getEnclosingFunction(node);
  const options = upgradeRawOverridableOptions(rawOptions[0]);
  const optionsToUse = getOptionsWithDefaults(
    functionNode === null ? options : getCoreOptions<CoreOptions, Options>(functionNode, context, options),
  );

  if (optionsToUse === null) {
    return {
      context,
      descriptors: [],
    };
  }

  const { ignoreIdentifierPattern } = optionsToUse;

  if (shouldIgnorePattern(node, context, ignoreIdentifierPattern)) {
    return {
      context,
      descriptors: [],
    };
  }

  const { allowArgumentsKeyword } = optionsToUse;

  return {
    context,
    descriptors:
      !allowArgumentsKeyword && !isPropertyName(node) && !isPropertyAccess(node)
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
export const rule: Rule<keyof typeof errorMessages, RawOptions> = createRuleUsingFunction<
  keyof typeof errorMessages,
  RawOptions
>(name, meta, defaultOptions, (context, options) => {
  const [optionsObject] = options;
  const { ignorePrefixSelector } = optionsObject;

  const baseFunctionSelectors = ["ArrowFunctionExpression", "FunctionDeclaration", "FunctionExpression"];

  const ignoreSelectors =
    ignorePrefixSelector === undefined
      ? undefined
      : Array.isArray(ignorePrefixSelector)
        ? ignorePrefixSelector
        : [ignorePrefixSelector];

  const fullFunctionSelectors = baseFunctionSelectors.flatMap((baseSelector) =>
    ignoreSelectors === undefined ? [baseSelector] : `:not(:matches(${ignoreSelectors.join(",")})) > ${baseSelector}`,
  );

  return {
    ...Object.fromEntries(fullFunctionSelectors.map((selector) => [selector, checkFunction])),
    Identifier: checkIdentifier,
  };
});
