import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { ReportFixFunction, RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import { Immutability } from "is-immutable-type";
import type { Type, TypeNode } from "typescript";

import {
  type IgnoreClassesOption,
  type OverridableOptions,
  type RawOverridableOptions,
  getCoreOptions,
  getCoreOptionsForType,
  ignoreClassesOptionSchema,
  shouldIgnoreClasses,
  shouldIgnoreInFunction,
  shouldIgnorePattern,
  upgradeRawOverridableOptions,
} from "#/options";
import { ruleNameScope } from "#/utils/misc";
import type { ESFunctionType } from "#/utils/node-types";
import {
  type NamedCreateRuleCustomMeta,
  type Rule,
  type RuleResult,
  createRule,
  getReturnTypesOfFunction,
  getTypeDataOfNode,
  getTypeImmutabilityOfNode,
  getTypeImmutabilityOfType,
  isImplementationOfOverload,
} from "#/utils/rule";
import {
  hasID,
  isArrayPattern,
  isDefined,
  isFunctionLike,
  isIdentifier,
  isMemberExpression,
  isObjectPattern,
  isProperty,
  isPropertyDefinition,
  isTSParameterProperty,
  isTSTypePredicate,
} from "#/utils/type-guards";

import { overridableOptionsSchema } from "../utils/schemas";

/**
 * The name of this rule.
 */
export const name = "prefer-immutable-types";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

type RawEnforcement =
  | Exclude<Immutability | keyof typeof Immutability, "Unknown" | "Mutable">
  | "None"
  | false
  | undefined;

type Option = IgnoreClassesOption & {
  enforcement: RawEnforcement;
  ignoreInferredTypes: boolean;
  ignoreNamePattern?: string[] | string;
  ignoreTypePattern?: string[] | string;
};

type CoreOptions = Option & {
  parameters?: Partial<Option> | RawEnforcement;
  returnTypes?: Partial<Option> | RawEnforcement;
  variables?:
    | Partial<
        Option & {
          ignoreInFunctions?: boolean;
        }
      >
    | RawEnforcement;
  fixer?: FixerConfigRawMap;
  suggestions?: SuggestionConfigRawMap;
};

type FixerConfigRaw = {
  pattern: string;
  replace: string;
};

type SuggestionsConfigRaw = Array<FixerConfigRaw & { message?: string }>;

type FixerConfigRawMap = Partial<
  Record<"ReadonlyShallow" | "ReadonlyDeep" | "Immutable", FixerConfigRaw | FixerConfigRaw[] | undefined>
>;

type SuggestionConfigRawMap = Partial<
  Record<"ReadonlyShallow" | "ReadonlyDeep" | "Immutable", SuggestionsConfigRaw[] | undefined>
>;

type FixerConfig = {
  pattern: RegExp;
  replace: string;
};

type SuggestionsConfig = Array<FixerConfig & { message?: string }>;

/**
 * The options this rule can take.
 */
type RawOptions = [RawOverridableOptions<CoreOptions>];
type Options = OverridableOptions<CoreOptions>;

/**
 * The enum options for the level of enforcement.
 */
const enforcementEnumOptions = [
  ...Object.values(Immutability).filter(
    (i) =>
      i !== Immutability.Unknown &&
      i !== Immutability[Immutability.Unknown] &&
      i !== Immutability.Mutable &&
      i !== Immutability[Immutability.Mutable],
  ),
  "None",
  false,
];

/**
 * The non-shorthand schema for each option.
 */
const optionExpandedSchema: JSONSchema4ObjectSchema["properties"] = deepmerge(ignoreClassesOptionSchema, {
  enforcement: {
    type: ["string", "number", "boolean"],
    enum: enforcementEnumOptions,
  },
  ignoreInferredTypes: {
    type: "boolean",
  },
  ignoreNamePattern: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
  ignoreTypePattern: {
    type: ["string", "array"],
    items: {
      type: "string",
    },
  },
} satisfies JSONSchema4ObjectSchema["properties"]);

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
 * The schema for each fixer config.
 */
const fixerSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "object",
      properties: {
        pattern: { type: "string" },
        replace: { type: "string" },
      },
      additionalProperties: false,
    },
    {
      type: "array",
      items: {
        type: "object",
        properties: {
          pattern: { type: "string" },
          replace: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  ],
};

const suggestionsSchema: JSONSchema4 = {
  type: "array",
  items: {
    type: "array",
    items: {
      type: "object",
      properties: {
        pattern: { type: "string" },
        replace: { type: "string" },
        message: { type: "string" },
      },
      additionalProperties: false,
    },
  },
};

const coreOptionsPropertiesSchema: NonNullable<JSONSchema4ObjectSchema["properties"]> = deepmerge(
  optionExpandedSchema,
  {
    parameters: optionSchema,
    returnTypes: optionSchema,
    variables: {
      oneOf: [
        {
          type: "object",
          properties: deepmerge(optionExpandedSchema, {
            ignoreInFunctions: {
              type: "boolean",
            },
          } satisfies JSONSchema4ObjectSchema["properties"]),
          additionalProperties: false,
        },
        {
          type: ["string", "number", "boolean"],
          enum: enforcementEnumOptions,
        },
      ],
    },
    fixer: {
      type: "object",
      properties: {
        ReadonlyShallow: fixerSchema,
        ReadonlyDeep: fixerSchema,
        Immutable: fixerSchema,
      },
      additionalProperties: false,
    },
    suggestions: {
      type: "object",
      properties: {
        ReadonlyShallow: suggestionsSchema,
        ReadonlyDeep: suggestionsSchema,
        Immutable: suggestionsSchema,
      },
      additionalProperties: false,
    },
  } satisfies JSONSchema4ObjectSchema["properties"],
);

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [overridableOptionsSchema(coreOptionsPropertiesSchema)];

/**
 * The default options for the rule.
 */
const defaultOptions = [
  {
    enforcement: Immutability.Immutable,
    ignoreInferredTypes: false,
    ignoreClasses: false,
    suggestions: {
      ReadonlyShallow: [
        [
          {
            pattern: "^([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*\\[\\])$",
            replace: "readonly $1",
            message: "Prepend with readonly.",
          },
          {
            pattern: "^(Array|Map|Set)<(.+)>$",
            replace: "Readonly$1<$2>",
            message: "Use Readonly$1 instead of $1.",
          },
        ],
        [
          {
            pattern: "^(.+)$",
            replace: "Readonly<$1>",
            message: "Surround with Readonly.",
          },
        ],
      ],
    },
  },
] satisfies RawOptions;

/**
 * The possible error messages.
 */
const errorMessages = {
  parameter: 'Parameter should have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  returnType: 'Return type should have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  variable: 'Variable should have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  propertyImmutability: 'Property should have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  propertyModifier: "Property should have a readonly modifier.",
  propertyModifierSuggestion: "Add readonly modifier.",
  userDefined: "{{ message }}",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Require function parameters to be typed as certain immutability",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  fixable: "code",
  hasSuggestions: true,
  messages: errorMessages,
  schema,
};

type Descriptor = RuleResult<keyof typeof errorMessages, RawOptions>["descriptors"][number];

type AllFixers = {
  fix: ReportFixFunction | null;
  suggestionFixers: Array<{ fix: ReportFixFunction; message: string }> | null;
};

/**
 * Get the fixer and the suggestions' fixers.
 */
function getAllFixers(
  node: TSESTree.Node,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  fixerConfigs: FixerConfig[] | false,
  suggestionsConfigs: SuggestionsConfig[] | false,
): AllFixers {
  const nodeText = context.sourceCode.getText(node).replaceAll(/\s+/gu, " ");

  const fix = fixerConfigs === false ? null : getConfiguredFixer(node, nodeText, fixerConfigs);

  const suggestionFixers =
    suggestionsConfigs === false ? null : getConfiguredSuggestionFixers(node, nodeText, suggestionsConfigs);

  return { fix, suggestionFixers };
}

/**
 * Get a fixer that uses the user config.
 */
function getConfiguredFixer(
  node: TSESTree.Node,
  text: string,
  configs: ReadonlyArray<FixerConfig>,
): NonNullable<Descriptor["fix"]> | null {
  const config = configs.find((c) => c.pattern.test(text));
  if (config === undefined) {
    return null;
  }
  return (fixer) => fixer.replaceText(node, text.replace(config.pattern, config.replace));
}

/**
 * Get a fixer that uses the user config.
 */
function getConfiguredSuggestionFixers(
  node: TSESTree.Node,
  text: string,
  suggestionsConfigs: ReadonlyArray<SuggestionsConfig>,
) {
  return suggestionsConfigs
    .map((configs): { fix: NonNullable<Descriptor["fix"]>; message: string } | null => {
      const config = configs.find((c) => c.pattern.test(text));
      if (config === undefined) {
        return null;
      }
      return {
        fix: (fixer) => fixer.replaceText(node, text.replace(config.pattern, config.replace)),
        message:
          config.message === undefined
            ? `Replace with: ${text.replace(config.pattern, config.replace)}`
            : text.replace(config.pattern, config.message),
      };
    })
    .filter(isDefined);
}

/**
 * Get the level of enforcement from the raw value given.
 */
function parseEnforcement(rawEnforcement: RawEnforcement) {
  return rawEnforcement === "None" || rawEnforcement === undefined
    ? false
    : typeof rawEnforcement === "string"
      ? Immutability[rawEnforcement]
      : rawEnforcement;
}

/**
 * Get the fixer config for the the given enforcement level from the raw config given.
 */
function parseFixerConfigs(allRawConfigs: RawOptions[0]["fixer"], enforcement: Immutability): FixerConfig[] | false {
  const key = Immutability[enforcement] as keyof NonNullable<typeof allRawConfigs>;
  const rawConfigs = allRawConfigs?.[key];
  if (rawConfigs === undefined) {
    return false;
  }
  const raws = Array.isArray(rawConfigs) ? rawConfigs : [rawConfigs];
  return raws.map((r) => ({
    ...r,
    pattern: new RegExp(r.pattern, "u"),
  }));
}

/**
 * Get the suggestions config for the the given enforcement level from the raw config given.
 */
function parseSuggestionsConfigs(
  rawSuggestions: RawOptions[0]["suggestions"],
  enforcement: Immutability,
): SuggestionsConfig[] | false {
  const key = Immutability[enforcement] as keyof NonNullable<typeof rawSuggestions>;
  const rawConfigsSet = rawSuggestions?.[key];
  if (rawConfigsSet === undefined) {
    return false;
  }
  return rawConfigsSet.map((rawConfigs) =>
    rawConfigs.map((rawConfig) => ({
      ...rawConfig,
      pattern: new RegExp(rawConfig.pattern, "u"),
    })),
  );
}

/**
 * Get the parameter type violations.
 */
function getParameterTypeViolations(
  node: ESFunctionType,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  options: Readonly<Options>,
): Descriptor[] {
  return node.params
    .map((param): Descriptor | undefined => {
      const parameterProperty = isTSParameterProperty(param);
      const actualParam = parameterProperty ? param.parameter : param;

      const optionsToUse = getOptionsWithDefaults(getCoreOptions<CoreOptions, Options>(param, context, options));

      if (optionsToUse === null) {
        return undefined;
      }

      const { parameters: rawOption, fixer: rawFixerConfig, suggestions: rawSuggestionsConfigs } = optionsToUse;
      const {
        enforcement: rawEnforcement,
        ignoreInferredTypes,
        ignoreClasses,
        ignoreNamePattern,
        ignoreTypePattern,
      } = {
        ignoreInferredTypes: optionsToUse.ignoreInferredTypes,
        ignoreClasses: optionsToUse.ignoreClasses,
        ignoreNamePattern: optionsToUse.ignoreNamePattern,
        ignoreTypePattern: optionsToUse.ignoreTypePattern,
        ...(typeof rawOption === "object"
          ? rawOption
          : {
              enforcement: rawOption,
            }),
      };

      const enforcement = parseEnforcement(rawEnforcement ?? optionsToUse.enforcement);
      if (enforcement === false || shouldIgnoreClasses(node, context, ignoreClasses)) {
        return undefined;
      }

      const fixerConfigs = parseFixerConfigs(rawFixerConfig, enforcement);
      const suggestionsConfigs = parseSuggestionsConfigs(rawSuggestionsConfigs, enforcement);

      if (shouldIgnorePattern(param, context, ignoreNamePattern)) {
        return undefined;
      }

      if (parameterProperty && !param.readonly) {
        const fix: NonNullable<Descriptor["fix"]> | null = (fixer) =>
          fixer.insertTextBefore(param.parameter, "readonly ");

        return {
          node: param,
          messageId: "propertyModifier",
          fix: fixerConfigs === false ? null : fix,
          suggest: [
            {
              messageId: "propertyModifierSuggestion",
              fix,
            },
          ],
        };
      }

      if (
        // inferred types
        (ignoreInferredTypes && actualParam.typeAnnotation === undefined) ||
        // ignored
        (actualParam.typeAnnotation !== undefined &&
          shouldIgnorePattern(actualParam.typeAnnotation, context, ignoreTypePattern)) ||
        // type guard
        (node.returnType !== undefined &&
          isTSTypePredicate(node.returnType.typeAnnotation) &&
          isIdentifier(node.returnType.typeAnnotation.parameterName) &&
          isIdentifier(actualParam) &&
          actualParam.name === node.returnType.typeAnnotation.parameterName.name)
      ) {
        return undefined;
      }

      const immutability = getTypeImmutabilityOfNode(actualParam, context, enforcement);

      if (immutability >= enforcement) {
        return undefined;
      }

      const { fix, suggestionFixers } =
        actualParam.typeAnnotation === undefined
          ? ({} as AllFixers)
          : getAllFixers(actualParam.typeAnnotation.typeAnnotation, context, fixerConfigs, suggestionsConfigs);

      return {
        node: actualParam,
        messageId: "parameter",
        data: {
          actual: Immutability[immutability],
          expected: Immutability[enforcement],
        },
        fix,
        suggest:
          suggestionFixers?.map(({ fix, message }) => ({
            messageId: "userDefined",
            data: {
              message,
            },
            fix,
          })) ?? null,
      };
    })
    .filter(isDefined);
}

/**
 * Get the return type violations.
 */
function getReturnTypeViolations(
  node: ESFunctionType,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  options: Readonly<Options>,
): Descriptor[] {
  function getOptions(type: Type, typeNode: TypeNode | null) {
    const optionsToUse = getOptionsWithDefaults(
      getCoreOptionsForType<CoreOptions, Options>(type, typeNode, context, options),
    );

    if (optionsToUse === null) {
      return null;
    }

    const { returnTypes: rawOption, fixer: rawFixerConfig, suggestions: rawSuggestionsConfigs } = optionsToUse;
    const {
      enforcement: rawEnforcement,
      ignoreClasses,
      ignoreNamePattern,
      ignoreTypePattern,
      ignoreInferredTypes,
    } = {
      ignoreClasses: optionsToUse.ignoreClasses,
      ignoreNamePattern: optionsToUse.ignoreNamePattern,
      ignoreTypePattern: optionsToUse.ignoreTypePattern,
      ignoreInferredTypes: optionsToUse.ignoreInferredTypes,
      ...(typeof rawOption === "object" ? rawOption : { enforcement: rawOption }),
    };

    const enforcement = parseEnforcement(rawEnforcement ?? optionsToUse.enforcement);

    if (
      enforcement === false ||
      shouldIgnoreClasses(node, context, ignoreClasses) ||
      shouldIgnorePattern(node, context, ignoreNamePattern)
    ) {
      return null;
    }

    const fixerConfigs = parseFixerConfigs(rawFixerConfig, enforcement);
    const suggestionsConfigs = parseSuggestionsConfigs(rawSuggestionsConfigs, enforcement);

    return {
      ignoreTypePattern,
      ignoreInferredTypes,
      enforcement,
      fixerConfigs,
      suggestionsConfigs,
    };
  }

  if (node.returnType?.typeAnnotation !== undefined) {
    const [type, typeNode] = getTypeDataOfNode(node, context);
    const optionsToUse = getOptions(type, typeNode);
    if (optionsToUse === null) {
      return [];
    }

    const { ignoreTypePattern, enforcement, fixerConfigs, suggestionsConfigs } = optionsToUse;

    if (node.returnType?.typeAnnotation !== undefined && !isTSTypePredicate(node.returnType.typeAnnotation)) {
      if (shouldIgnorePattern(node.returnType, context, ignoreTypePattern)) {
        return [];
      }

      const immutability = getTypeImmutabilityOfNode(node.returnType.typeAnnotation, context, enforcement);

      if (immutability >= enforcement) {
        return [];
      }

      const { fix, suggestionFixers } = getAllFixers(
        node.returnType.typeAnnotation,
        context,
        fixerConfigs,
        suggestionsConfigs,
      );

      return [
        {
          node: node.returnType,
          messageId: "returnType",
          data: {
            actual: Immutability[immutability],
            expected: Immutability[enforcement],
          },
          fix,
          suggest:
            suggestionFixers?.map(({ fix, message }) => ({
              messageId: "userDefined",
              data: {
                message,
              },
              fix,
            })) ?? null,
        },
      ];
    }
  }

  if (!isFunctionLike(node)) {
    return [];
  }

  const returnTypes = getReturnTypesOfFunction(node, context);
  if (returnTypes === null || returnTypes.length !== 1 || isImplementationOfOverload(node, context)) {
    return [];
  }

  const returnType = returnTypes[0]!;

  const optionsToUse = getOptions(returnType, (returnType as Type & { node: TypeNode }).node ?? null);
  if (optionsToUse === null) {
    return [];
  }

  const { ignoreInferredTypes, enforcement, fixerConfigs, suggestionsConfigs } = optionsToUse;

  if (ignoreInferredTypes) {
    return [];
  }

  const immutability = getTypeImmutabilityOfType(returnType, context, enforcement);

  if (immutability >= enforcement) {
    return [];
  }

  const { fix, suggestionFixers } =
    node.returnType?.typeAnnotation === undefined
      ? ({} as AllFixers)
      : getAllFixers(node.returnType.typeAnnotation, context, fixerConfigs, suggestionsConfigs);

  return [
    {
      node: hasID(node) && node.id !== null ? node.id : node,
      messageId: "returnType",
      data: {
        actual: Immutability[immutability],
        expected: Immutability[enforcement],
      },
      fix,
      suggest:
        suggestionFixers?.map(({ fix, message }) => ({
          messageId: "userDefined",
          data: {
            message,
          },
          fix,
        })) ?? null,
    },
  ];
}

/**
 * Add the default options to the given options.
 */
function getOptionsWithDefaults(options: Readonly<Options> | null): Options | null {
  if (options === null) {
    return null;
  }

  return {
    ...defaultOptions[0],
    ...options,
  };
}

/**
 * Check if the given function node violates this rule.
 */
function checkFunction(
  node: ESFunctionType,
  context: Readonly<RuleContext<keyof typeof errorMessages, RawOptions>>,
  rawOptions: Readonly<RawOptions>,
): RuleResult<keyof typeof errorMessages, RawOptions> {
  const options = upgradeRawOverridableOptions(rawOptions[0]);

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
function checkVariable(
  node: TSESTree.VariableDeclarator | TSESTree.PropertyDefinition,
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

  const { variables: rawOption, fixer: rawFixerConfig, suggestions: rawSuggestionsConfigs } = optionsToUse;
  const {
    enforcement: rawEnforcement,
    ignoreInferredTypes,
    ignoreClasses,
    ignoreNamePattern,
    ignoreTypePattern,
    ignoreInFunctions,
  } = {
    ignoreInferredTypes: optionsToUse.ignoreInferredTypes,
    ignoreClasses: optionsToUse.ignoreClasses,
    ignoreNamePattern: optionsToUse.ignoreNamePattern,
    ignoreTypePattern: optionsToUse.ignoreTypePattern,
    ignoreInFunctions: false,
    ...(typeof rawOption === "object" ? rawOption : { enforcement: rawOption }),
  };

  const enforcement = parseEnforcement(rawEnforcement ?? optionsToUse.enforcement);

  if (
    enforcement === false ||
    shouldIgnoreClasses(node, context, ignoreClasses) ||
    shouldIgnoreInFunction(node, context, ignoreInFunctions) ||
    shouldIgnorePattern(node, context, ignoreNamePattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const propertyDefinition = isPropertyDefinition(node);

  if (propertyDefinition && !node.readonly) {
    const fix: NonNullable<Descriptor["fix"]> | null = (fixer) => fixer.insertTextBefore(node.key, "readonly ");

    return {
      context,
      descriptors: [
        {
          node,
          messageId: "propertyModifier",
          fix: rawFixerConfig === undefined ? null : fix,
          suggest: [
            {
              messageId: "propertyModifierSuggestion",
              fix,
            },
          ],
        },
      ],
    };
  }

  const nodeWithTypeAnnotation = propertyDefinition ? node : node.id;

  if (ignoreInferredTypes && nodeWithTypeAnnotation.typeAnnotation === undefined) {
    return {
      context,
      descriptors: [],
    };
  }

  if (
    nodeWithTypeAnnotation.typeAnnotation !== undefined &&
    shouldIgnorePattern(nodeWithTypeAnnotation.typeAnnotation, context, ignoreTypePattern)
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const elements = isArrayPattern(nodeWithTypeAnnotation)
    ? nodeWithTypeAnnotation.elements
    : isObjectPattern(nodeWithTypeAnnotation)
      ? nodeWithTypeAnnotation.properties
      : [nodeWithTypeAnnotation];

  const elementResults = elements.map((element) => {
    if (!isDefined(element)) {
      return null;
    }

    const immutability = getTypeImmutabilityOfNode(element, context, enforcement);

    if (immutability >= enforcement) {
      return null;
    }

    const fixerConfigs = parseFixerConfigs(rawFixerConfig, enforcement);
    const suggestionsConfigs = parseSuggestionsConfigs(rawSuggestionsConfigs, enforcement);

    const { fix, suggestionFixers } =
      isMemberExpression(element) || isProperty(element) || element.typeAnnotation === undefined
        ? ({} as AllFixers)
        : getAllFixers(element.typeAnnotation.typeAnnotation, context, fixerConfigs, suggestionsConfigs);

    return { element, immutability, fix, suggestionFixers };
  });

  const messageId = propertyDefinition ? "propertyImmutability" : "variable";

  return {
    context,
    descriptors: elementResults.filter(isDefined).map(({ element, immutability, fix, suggestionFixers }) => {
      const data = {
        actual: Immutability[immutability],
        expected: Immutability[enforcement],
      };

      return {
        node: element,
        messageId,
        data,
        fix,
        suggest:
          suggestionFixers?.map(({ fix, message }) => ({
            messageId: "userDefined",
            data: {
              message,
            },
            fix,
          })) ?? null,
      };
    }),
  };
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, RawOptions> = createRule<keyof typeof errorMessages, RawOptions>(
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
    PropertyDefinition: checkVariable,
    VariableDeclarator: checkVariable,
  },
);
