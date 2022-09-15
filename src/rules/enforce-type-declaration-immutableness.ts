import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import { Immutableness } from "is-immutable-type";
import type { JSONSchema4 } from "json-schema";
import type { ReadonlyDeep } from "type-fest";

import type { IgnorePatternOption } from "~/common/ignore-options";
import {
  shouldIgnorePattern,
  ignorePatternOptionSchema,
} from "~/common/ignore-options";
import { getNodeIdentifierTexts } from "~/util/misc";
import type { ESTypeDeclaration } from "~/util/node-types";
import type { RuleResult } from "~/util/rule";
import { getTypeImmutablenessOfNode, createRule } from "~/util/rule";
import { isReadonlyArray } from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "enforce-type-declaration-immutableness" as const;

/**
 * How the actual immutableness should be compared to the given immutableness.
 */
export enum RuleEnforcementComparator {
  Less = -2,
  AtMost = -1,
  Exactly = 0,
  AtLeast = 1,
  More = 2,
}

/**
 * The options this rule can take.
 */
type Options = ReadonlyDeep<
  [
    IgnorePatternOption & {
      rules?: Array<{
        identifier: string | string[];
        immutableness: Exclude<
          Immutableness | keyof typeof Immutableness,
          "Unknown"
        >;
        comparator?:
          | RuleEnforcementComparator
          | keyof typeof RuleEnforcementComparator;
      }>;
    }
  ]
>;

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4 = [
  {
    type: "object",
    properties: deepmerge(ignorePatternOptionSchema, {
      rules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            identifier: {
              type: ["string", "array"],
              items: {
                type: "string",
              },
            },
            immutableness: {
              type: ["string", "number"],
              enum: Object.values(Immutableness).filter(
                (i) =>
                  i !== Immutableness.Unknown &&
                  i !== Immutableness[Immutableness.Unknown]
              ),
            },
            comparator: {
              type: ["string", "number"],
              enum: Object.values(RuleEnforcementComparator),
            },
          },
          required: ["identifier", "immutableness"],
          additionalProperties: false,
        },
      },
    }),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [{}];

/**
 * The possible error messages.
 */
const errorMessages = {
  Less: 'This type is declare to have an immutableness less than "{{ expected }}" (actual: "{{ actual }}").',
  AtLeast:
    'This type is declare to have an immutableness of at least "{{ expected }}" (actual: "{{ actual }}").',
  Exactly:
    'This type is declare to have an immutableness of exactly "{{ expected }}" (actual: "{{ actual }}").',
  AtMost:
    'This type is declare to have an immutableness of at most "{{ expected }}" (actual: "{{ actual }}").',
  More: 'This type is declare to have an immutableness more than "{{ expected }}" (actual: "{{ actual }}").',
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce the immutableness of types based on patterns.",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * A rule given by the user after being upgraded.
 */
export type ImmutablenessRule = {
  identifiers: ReadonlyArray<RegExp>;
  immutableness: Immutableness;
  comparator: RuleEnforcementComparator;
};

/**
 * Get the default immutableness rules.
 */
function getDefaultImmutablenessRules(): ImmutablenessRule[] {
  return [
    {
      identifiers: [/^I?Immutable.+/u],
      immutableness: Immutableness.Immutable,
      comparator: RuleEnforcementComparator.AtLeast,
    },
    {
      identifiers: [/^I?ReadonlyDeep.+/u],
      immutableness: Immutableness.ReadonlyDeep,
      comparator: RuleEnforcementComparator.AtLeast,
    },
    {
      identifiers: [/^I?Readonly.+/u],
      immutableness: Immutableness.ReadonlyShallow,
      comparator: RuleEnforcementComparator.AtLeast,
    },
    {
      identifiers: [/^I?Mutable.+/u],
      immutableness: Immutableness.Mutable,
      comparator: RuleEnforcementComparator.AtMost,
    },
  ];
}

/**
 * Get all the rules that were given and upgrade them.
 */
function getRules(options: Options): ImmutablenessRule[] {
  const [optionsObject] = options;
  const { rules: rulesOptions } = optionsObject;

  if (rulesOptions === undefined) {
    return getDefaultImmutablenessRules();
  }

  return rulesOptions.map((rule): ImmutablenessRule => {
    const identifiers = isReadonlyArray(rule.identifier)
      ? rule.identifier.map((id) => new RegExp(id, "u"))
      : [new RegExp(rule.identifier, "u")];

    const immutableness =
      typeof rule.immutableness === "string"
        ? Immutableness[rule.immutableness]
        : rule.immutableness;

    const comparator =
      rule.comparator === undefined
        ? RuleEnforcementComparator.AtLeast
        : typeof rule.comparator === "string"
        ? RuleEnforcementComparator[rule.comparator]
        : rule.comparator;

    return {
      identifiers,
      immutableness,
      comparator,
    };
  });
}

/**
 * Find the first rule to apply to the given node.
 */
export function getRuleToApply(
  node: ReadonlyDeep<TSESTree.Node>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): ImmutablenessRule | undefined {
  const rules = getRules(options);
  if (rules.length === 0) {
    return undefined;
  }

  const texts = getNodeIdentifierTexts(node, context);

  if (texts.length === 0) {
    return undefined;
  }

  return rules.find((rule) =>
    rule.identifiers.some((pattern) => texts.some((text) => pattern.test(text)))
  );
}

/**
 * Compare the actual immutableness to the expected immutableness.
 */
export function compareImmutableness(
  rule: ReadonlyDeep<ImmutablenessRule>,
  actual: Immutableness
) {
  switch (rule.comparator) {
    case RuleEnforcementComparator.Less:
      return actual < rule.immutableness;
    case RuleEnforcementComparator.AtMost:
      return actual <= rule.immutableness;
    case RuleEnforcementComparator.Exactly:
      return actual === rule.immutableness;
    case RuleEnforcementComparator.AtLeast:
      return actual >= rule.immutableness;
    case RuleEnforcementComparator.More:
      return actual > rule.immutableness;
  }
}

/**
 * Get the results.
 */
function getResults(
  node: ReadonlyDeep<ESTypeDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  rule: ImmutablenessRule,
  immutableness: Immutableness
): RuleResult<keyof typeof errorMessages, Options> {
  const valid = compareImmutableness(rule, immutableness);
  if (valid) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: [
      {
        node: node.id,
        messageId: RuleEnforcementComparator[
          rule.comparator
        ] as keyof typeof RuleEnforcementComparator,
        data: {
          actual: Immutableness[immutableness],
          expected: Immutableness[rule.immutableness],
        },
      },
    ],
  };
}

/**
 * Check if the given Interface or Type Alias violates this rule.
 */
function checkTypeDeclaration(
  node: ReadonlyDeep<ESTypeDeclaration>,
  context: ReadonlyDeep<
    TSESLint.RuleContext<keyof typeof errorMessages, Options>
  >,
  options: Options
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  if (shouldIgnorePattern(node, context, optionsObject)) {
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

  const immutableness = getTypeImmutablenessOfNode(node, context);

  return getResults(node, context, rule, immutableness);
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    TSTypeAliasDeclaration: checkTypeDeclaration,
    TSInterfaceDeclaration: checkTypeDeclaration,
  }
);
