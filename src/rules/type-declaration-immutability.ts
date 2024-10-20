import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4, JSONSchema4ObjectSchema } from "@typescript-eslint/utils/json-schema";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import { Immutability } from "is-immutable-type";

import {
  type IgnoreIdentifierPatternOption,
  ignoreIdentifierPatternOptionSchema,
  shouldIgnorePattern,
} from "#/options";
import { getNodeIdentifierTexts, ruleNameScope } from "#/utils/misc";
import type { ESTypeDeclaration } from "#/utils/node-types";
import {
  type NamedCreateRuleCustomMeta,
  type Rule,
  type RuleResult,
  createRule,
  getTypeImmutabilityOfNode,
} from "#/utils/rule";
import { isTSInterfaceDeclaration } from "#/utils/type-guards";

/**
 * The name of this rule.
 */
export const name = "type-declaration-immutability";

/**
 * The full name of this rule.
 */
export const fullName: `${typeof ruleNameScope}/${typeof name}` = `${ruleNameScope}/${name}`;

/**
 * How the actual immutability should be compared to the given immutability.
 */
export enum RuleEnforcementComparator {
  Less = -2,
  AtMost = -1,
  Exactly = 0,
  AtLeast = 1,
  More = 2,
}

type FixerConfigRaw = {
  pattern: string;
  replace: string;
};

type FixerConfig = {
  pattern: RegExp;
  replace: string;
};

type SuggestionsConfig = FixerConfig[];

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreIdentifierPatternOption & {
    rules: Array<{
      identifiers: string | string[];
      immutability: Exclude<Immutability | keyof typeof Immutability, "Unknown">;
      comparator?: RuleEnforcementComparator | keyof typeof RuleEnforcementComparator;
      fixer?: FixerConfigRaw | FixerConfigRaw[] | false;
      suggestions?: FixerConfigRaw[] | false;
    }>;
    ignoreInterfaces: boolean;
  },
];

/**
 * The schema for each fixer config.
 */
const fixerSchema: JSONSchema4 = {
  oneOf: [
    {
      type: "boolean",
      enum: [false],
    },
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
  oneOf: [
    {
      type: "boolean",
      enum: [false],
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

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(ignoreIdentifierPatternOptionSchema, {
      rules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            identifiers: {
              type: ["string", "array"],
              items: {
                type: ["string"],
              },
            },
            immutability: {
              type: ["string", "number"],
              enum: Object.values(Immutability).filter(
                (i) => i !== Immutability.Unknown && i !== Immutability[Immutability.Unknown],
              ),
            },
            comparator: {
              type: ["string", "number"],
              enum: Object.values(RuleEnforcementComparator),
            },
            fixer: fixerSchema,
            suggestions: suggestionsSchema,
          },
          required: ["identifiers", "immutability"],
          additionalProperties: false,
        },
      },
      ignoreInterfaces: {
        type: "boolean",
      },
    } satisfies JSONSchema4ObjectSchema["properties"]),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    rules: [
      {
        identifiers: ["^(?!I?Mutable).+"],
        immutability: Immutability.Immutable,
        comparator: RuleEnforcementComparator.AtLeast,
      },
    ],
    ignoreInterfaces: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  Less: 'This type is declare to have an immutability less than "{{ expected }}" (actual: "{{ actual }}").',
  AtLeast: 'This type is declare to have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  Exactly: 'This type is declare to have an immutability of exactly "{{ expected }}" (actual: "{{ actual }}").',
  AtMost: 'This type is declare to have an immutability of at most "{{ expected }}" (actual: "{{ actual }}").',
  More: 'This type is declare to have an immutability more than "{{ expected }}" (actual: "{{ actual }}").',
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleCustomMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Enforce the immutability of types based on patterns.",
    recommended: "recommended",
    recommendedSeverity: "error",
    requiresTypeChecking: true,
  },
  messages: errorMessages,
  fixable: "code",
  hasSuggestions: true,
  schema,
};

/**
 * A rule given by the user after being upgraded.
 */
export type ImmutabilityRule = {
  identifiers: RegExp[];
  immutability: Immutability;
  comparator: RuleEnforcementComparator;
  fixers: FixerConfig[] | false;
  suggestions: SuggestionsConfig | false;
};

type Descriptor = RuleResult<keyof typeof errorMessages, Options>["descriptors"][number];

/**
 * Get all the rules that were given and upgrade them.
 */
function getRules(options: Readonly<Options>): ImmutabilityRule[] {
  const [optionsObject] = options;
  const { rules: rulesOptions } = optionsObject;

  return rulesOptions.map((rule): ImmutabilityRule => {
    const identifiers = Array.isArray(rule.identifiers)
      ? rule.identifiers.map((id) => new RegExp(id, "u"))
      : [new RegExp(rule.identifiers, "u")];

    const immutability = typeof rule.immutability === "string" ? Immutability[rule.immutability] : rule.immutability;

    const comparator =
      rule.comparator === undefined
        ? RuleEnforcementComparator.AtLeast
        : typeof rule.comparator === "string"
          ? RuleEnforcementComparator[rule.comparator]
          : rule.comparator;

    const fixers =
      rule.fixer === undefined || rule.fixer === false
        ? false
        : (Array.isArray(rule.fixer) ? rule.fixer : [rule.fixer]).map((r) => ({
            ...r,
            pattern: new RegExp(r.pattern, "su"),
          }));

    const suggestions =
      rule.suggestions === undefined || rule.suggestions === false
        ? false
        : rule.suggestions.map((r) => ({
            ...r,
            pattern: new RegExp(r.pattern, "su"),
          }));

    return {
      identifiers,
      immutability,
      comparator,
      fixers,
      suggestions,
    };
  });
}

/**
 * Find the first rule to apply to the given node.
 */
function getRuleToApply(
  node: TSESTree.Node,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): ImmutabilityRule | undefined {
  const rules = getRules(options);
  if (rules.length === 0) {
    return undefined;
  }

  const texts = getNodeIdentifierTexts(node, context);

  if (texts.length === 0) {
    return undefined;
  }

  return rules.find((rule) => rule.identifiers.some((pattern) => texts.some((text) => pattern.test(text))));
}

/**
 * Get a fixer that uses the user config.
 */
function getConfiguredFixer<T extends TSESTree.Node>(
  node: T,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  configs: ReadonlyArray<FixerConfig>,
): NonNullable<Descriptor["fix"]> | null {
  const text = context.sourceCode.getText(node);
  const config = configs.find((c) => c.pattern.test(text));
  if (config === undefined) {
    return null;
  }
  return (fixer) => fixer.replaceText(node, text.replace(config.pattern, config.replace));
}

/**
 * Get the suggestions that uses the user config.
 */
function getConfiguredSuggestions<T extends TSESTree.Node>(
  node: T,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  configs: ReadonlyArray<FixerConfig>,
  messageId: keyof typeof errorMessages,
): NonNullable<Descriptor["suggest"]> | null {
  const text = context.sourceCode.getText(node);
  const matchingConfig = configs.filter((c) => c.pattern.test(text));
  if (matchingConfig.length === 0) {
    return null;
  }
  return matchingConfig.map((config) => ({
    fix: (fixer) => fixer.replaceText(node, text.replace(config.pattern, config.replace)),
    messageId,
  }));
}

/**
 * Compare the actual immutability to the expected immutability.
 */
function compareImmutability(rule: Readonly<ImmutabilityRule>, actual: Immutability) {
  switch (rule.comparator) {
    case RuleEnforcementComparator.Less: {
      return actual < rule.immutability;
    }
    case RuleEnforcementComparator.AtMost: {
      return actual <= rule.immutability;
    }
    case RuleEnforcementComparator.Exactly: {
      return actual === rule.immutability;
    }
    case RuleEnforcementComparator.AtLeast: {
      return actual >= rule.immutability;
    }
    case RuleEnforcementComparator.More: {
      return actual > rule.immutability;
    }
  }
}

/**
 * Get the results.
 */
function getResults(
  node: ESTypeDeclaration,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  rule: Readonly<ImmutabilityRule>,
  immutability: Immutability,
): RuleResult<keyof typeof errorMessages, Options> {
  const valid = compareImmutability(rule, immutability);
  if (valid) {
    return {
      context,
      descriptors: [],
    };
  }

  const messageId = RuleEnforcementComparator[rule.comparator] as keyof typeof RuleEnforcementComparator;

  const fix =
    rule.fixers === false || isTSInterfaceDeclaration(node)
      ? null
      : getConfiguredFixer(node.typeAnnotation, context, rule.fixers);

  const suggest =
    rule.suggestions === false || isTSInterfaceDeclaration(node)
      ? null
      : getConfiguredSuggestions(node.typeAnnotation, context, rule.suggestions, messageId);

  return {
    context,
    descriptors: [
      {
        node: node.id,
        messageId,
        data: {
          actual: Immutability[immutability],
          expected: Immutability[rule.immutability],
        },
        fix,
        suggest,
      },
    ],
  };
}

/**
 * Check if the given Interface or Type Alias violates this rule.
 */
function checkTypeDeclaration(
  node: ESTypeDeclaration,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { ignoreInterfaces, ignoreIdentifierPattern } = optionsObject;
  if (
    shouldIgnorePattern(node, context, ignoreIdentifierPattern) ||
    (ignoreInterfaces && isTSInterfaceDeclaration(node))
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  const rule = getRuleToApply(node, context, options);
  if (rule === undefined) {
    return {
      context,
      descriptors: [],
    };
  }

  const maxImmutability: Immutability | undefined =
    rule.comparator === RuleEnforcementComparator.AtLeast
      ? rule.immutability
      : rule.comparator === RuleEnforcementComparator.More
        ? rule.immutability + 1
        : undefined;

  const immutability = getTypeImmutabilityOfNode(node, context, maxImmutability);

  return getResults(node, context, rule, immutability);
}

// Create the rule.
export const rule: Rule<keyof typeof errorMessages, Options> = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSTypeAliasDeclaration: checkTypeDeclaration,
    TSInterfaceDeclaration: checkTypeDeclaration,
  },
);
