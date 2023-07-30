import { type TSESTree } from "@typescript-eslint/utils";
import {
  type JSONSchema4,
  type JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";
import { Immutability } from "is-immutable-type";

import {
  type IgnoreIdentifierPatternOption,
  shouldIgnorePattern,
  ignoreIdentifierPatternOptionSchema,
} from "#eslint-plugin-functional/options";
import { getNodeIdentifierTexts } from "#eslint-plugin-functional/utils/misc";
import { type ESTypeDeclaration } from "#eslint-plugin-functional/utils/node-types";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
  getTypeImmutabilityOfNode,
  createRule,
} from "#eslint-plugin-functional/utils/rule";
import { isTSInterfaceDeclaration } from "#eslint-plugin-functional/utils/type-guards";

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

type FixerConfigRaw = {
  pattern: string;
  replace: string;
};

type FixerConfig = {
  pattern: RegExp;
  replace: string;
};

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreIdentifierPatternOption & {
    rules: Array<{
      identifiers: string | string[];
      immutability: Exclude<
        Immutability | keyof typeof Immutability,
        "Unknown"
      >;
      comparator?:
        | RuleEnforcementComparator
        | keyof typeof RuleEnforcementComparator;
      fixer?: FixerConfigRaw | FixerConfigRaw[] | false;
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
                (i) =>
                  i !== Immutability.Unknown &&
                  i !== Immutability[Immutability.Unknown],
              ),
            },
            comparator: {
              type: ["string", "number"],
              enum: Object.values(RuleEnforcementComparator),
            },
            fixer: fixerSchema,
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
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Enforce the immutability of types based on patterns.",
  },
  messages: errorMessages,
  fixable: "code",
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
};

type Descriptor = RuleResult<
  keyof typeof errorMessages,
  Options
>["descriptors"][number];

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

    const fixers =
      rule.fixer === undefined || rule.fixer === false
        ? false
        : (Array.isArray(rule.fixer) ? rule.fixer : [rule.fixer]).map((r) => ({
            ...r,
            pattern: new RegExp(r.pattern, "us"),
          }));

    return {
      identifiers,
      immutability,
      comparator,
      fixers,
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

  return rules.find((rule) =>
    rule.identifiers.some((pattern) =>
      texts.some((text) => pattern.test(text)),
    ),
  );
}

/**
 * Get a fixer that uses the user config.
 */
function getConfiuredFixer<T extends TSESTree.Node>(
  node: T,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  configs: FixerConfig[],
): NonNullable<Descriptor["fix"]> | null {
  const text = context.getSourceCode().getText(node);
  const config = configs.find((c) => c.pattern.test(text));
  if (config === undefined) {
    return null;
  }
  return (fixer) =>
    fixer.replaceText(node, text.replace(config.pattern, config.replace));
}

/**
 * Compare the actual immutability to the expected immutability.
 */
function compareImmutability(rule: ImmutabilityRule, actual: Immutability) {
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
  rule: ImmutabilityRule,
  immutability: Immutability,
): RuleResult<keyof typeof errorMessages, Options> {
  const valid = compareImmutability(rule, immutability);
  if (valid) {
    return {
      context,
      descriptors: [],
    };
  }

  const fix =
    rule.fixers === false || isTSInterfaceDeclaration(node)
      ? null
      : getConfiuredFixer(node.typeAnnotation, context, rule.fixers);

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
        fix,
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

  const immutability = getTypeImmutabilityOfNode(
    node,
    context,
    maxImmutability,
  );

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
  },
);
