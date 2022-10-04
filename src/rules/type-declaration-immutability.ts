import type { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { deepmerge } from "deepmerge-ts";
import { Immutability } from "is-immutable-type";
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
import { getTypeImmutabilityOfNode, createRule } from "~/util/rule";
import { isReadonlyArray, isTSInterfaceDeclaration } from "~/util/typeguard";

/**
 * The name of this rule.
 */
export const name = "type-declaration-immutability" as const;

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

/**
 * The options this rule can take.
 */
type Options = ReadonlyDeep<
  [
    IgnorePatternOption & {
      rules: Array<{
        identifiers: (string | RegExp) | Array<string | RegExp>;
        immutability: Exclude<
          Immutability | keyof typeof Immutability,
          "Unknown"
        >;
        comparator?:
          | RuleEnforcementComparator
          | keyof typeof RuleEnforcementComparator;
      }>;
      ignoreInterfaces: boolean;
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
            identifiers: {
              type: ["string", "object", "array"],
              items: {
                type: ["string", "object"],
              },
            },
            immutability: {
              type: ["string", "number"],
              enum: Object.values(Immutability).filter(
                (i) =>
                  i !== Immutability.Unknown &&
                  i !== Immutability[Immutability.Unknown]
              ),
            },
            comparator: {
              type: ["string", "number"],
              enum: Object.values(RuleEnforcementComparator),
            },
          },
          required: ["identifiers", "immutability"],
          additionalProperties: false,
        },
      },
      ignoreInterfaces: {
        type: "boolean",
      },
    }),
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
        identifiers: [/^(?!I?Mutable).+/u],
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
  AtLeast:
    'This type is declare to have an immutability of at least "{{ expected }}" (actual: "{{ actual }}").',
  Exactly:
    'This type is declare to have an immutability of exactly "{{ expected }}" (actual: "{{ actual }}").',
  AtMost:
    'This type is declare to have an immutability of at most "{{ expected }}" (actual: "{{ actual }}").',
  More: 'This type is declare to have an immutability more than "{{ expected }}" (actual: "{{ actual }}").',
} as const;

/**
 * The meta data for this rule.
 */
const meta: ESLintUtils.NamedCreateRuleMeta<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Enforce the immutability of types based on patterns.",
    recommended: "error",
  },
  messages: errorMessages,
  schema,
};

/**
 * A rule given by the user after being upgraded.
 */
export type ImmutabilityRule = {
  identifiers: ReadonlyArray<RegExp>;
  immutability: Immutability;
  comparator: RuleEnforcementComparator;
};

/**
 * Get all the rules that were given and upgrade them.
 */
function getRules(options: Options): ImmutabilityRule[] {
  const [optionsObject] = options;
  const { rules: rulesOptions } = optionsObject;

  return rulesOptions.map((rule): ImmutabilityRule => {
    const identifiers = isReadonlyArray(rule.identifiers)
      ? rule.identifiers.map((id) =>
          id instanceof RegExp ? id : new RegExp(id, "u")
        )
      : [
          rule.identifiers instanceof RegExp
            ? rule.identifiers
            : new RegExp(rule.identifiers, "u"),
        ];

    const immutability =
      typeof rule.immutability === "string"
        ? Immutability[rule.immutability]
        : rule.immutability;

    const comparator =
      rule.comparator === undefined
        ? RuleEnforcementComparator.AtLeast
        : typeof rule.comparator === "string"
        ? RuleEnforcementComparator[rule.comparator]
        : rule.comparator;

    return {
      identifiers,
      immutability,
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
): ImmutabilityRule | undefined {
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
 * Compare the actual immutability to the expected immutability.
 */
export function compareImmutability(
  rule: ReadonlyDeep<ImmutabilityRule>,
  actual: Immutability
) {
  switch (rule.comparator) {
    case RuleEnforcementComparator.Less:
      return actual < rule.immutability;
    case RuleEnforcementComparator.AtMost:
      return actual <= rule.immutability;
    case RuleEnforcementComparator.Exactly:
      return actual === rule.immutability;
    case RuleEnforcementComparator.AtLeast:
      return actual >= rule.immutability;
    case RuleEnforcementComparator.More:
      return actual > rule.immutability;
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
  rule: ImmutabilityRule,
  immutability: Immutability
): RuleResult<keyof typeof errorMessages, Options> {
  const valid = compareImmutability(rule, immutability);
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
          actual: Immutability[immutability],
          expected: Immutability[rule.immutability],
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
  const { ignoreInterfaces, ignorePattern } = optionsObject;
  if (
    shouldIgnorePattern(node, context, ignorePattern) ||
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

  const immutability = getTypeImmutabilityOfNode(node, context);

  return getResults(node, context, rule, immutability);
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
