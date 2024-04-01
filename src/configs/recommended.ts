import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import { Immutability } from "is-immutable-type";

import { rules } from "#eslint-plugin-functional/rules";
import * as functionalParameters from "#eslint-plugin-functional/rules/functional-parameters";
import * as noConditionalStatements from "#eslint-plugin-functional/rules/no-conditional-statements";
import * as noLet from "#eslint-plugin-functional/rules/no-let";
import * as noThisExpressions from "#eslint-plugin-functional/rules/no-this-expressions";
import * as noThrowStatements from "#eslint-plugin-functional/rules/no-throw-statements";
import * as noTryStatements from "#eslint-plugin-functional/rules/no-try-statements";
import * as preferImmutableTypes from "#eslint-plugin-functional/rules/prefer-immutable-types";
import * as typeDeclarationImmutability from "#eslint-plugin-functional/rules/type-declaration-immutability";
import { RuleEnforcementComparator } from "#eslint-plugin-functional/rules/type-declaration-immutability";
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

const recommended = Object.fromEntries(
  Object.entries(rules)
    .filter(
      ([, rule]) =>
        rule.meta.deprecated !== true &&
        rule.meta.docs.recommended === "recommended" &&
        rule.meta.docs.category !== "Stylistic",
    )
    .map(([name, rule]) => [
      `${ruleNameScope}/${name}`,
      rule.meta.docs.recommendedSeverity,
    ]),
) satisfies FlatConfig.Config["rules"];

const overrides = {
  [functionalParameters.fullName]: [
    "error",
    {
      enforceParameterCount: {
        ignoreLambdaExpression: true,
        ignoreIIFE: true,
        ignoreGettersAndSetters: true,
      },
    },
  ],
  [noConditionalStatements.fullName]: [
    "error",
    {
      allowReturningBranches: true,
    },
  ],
  [noLet.fullName]: [
    "error",
    {
      allowInForLoopInit: true,
    },
  ],
  [noThisExpressions.fullName]: "off",
  [noThrowStatements.fullName]: [
    "error",
    {
      allowInAsyncFunctions: true,
    },
  ],
  [noTryStatements.fullName]: "off",
  [preferImmutableTypes.fullName]: [
    "error",
    {
      enforcement: "None",
      ignoreInferredTypes: true,
      parameters: {
        enforcement: "ReadonlyDeep",
      },
    },
  ],
  [typeDeclarationImmutability.fullName]: [
    "error",
    {
      rules: [
        {
          identifiers: ["^I?Immutable.+"],
          immutability: Immutability.Immutable,
          comparator: RuleEnforcementComparator.AtLeast,
        },
        {
          identifiers: ["^I?ReadonlyDeep.+"],
          immutability: Immutability.ReadonlyDeep,
          comparator: RuleEnforcementComparator.AtLeast,
        },
        {
          identifiers: ["^I?Readonly.+"],
          immutability: Immutability.ReadonlyShallow,
          comparator: RuleEnforcementComparator.AtLeast,
          suggestions: [
            {
              pattern: "^(Array|Map|Set)<(.+)>$",
              replace: "Readonly$1<$2>",
            },
            {
              pattern: "^(.+)$",
              replace: "Readonly<$1>",
            },
          ],
        },
        {
          identifiers: ["^I?Mutable.+"],
          immutability: Immutability.Mutable,
          comparator: RuleEnforcementComparator.AtMost,
          suggestions: [
            {
              pattern: "^Readonly(Array|Map|Set)<(.+)>$",
              replace: "$1<$2>",
            },
            {
              pattern: "^Readonly<(.+)>$",
              replace: "$1",
            },
          ],
        },
      ],
    },
  ],
} satisfies FlatConfig.Config["rules"];

export default {
  ...recommended,
  ...overrides,
};
