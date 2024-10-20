import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import { Immutability } from "is-immutable-type";

import { rules } from "#/rules";
import * as functionalParameters from "#/rules/functional-parameters";
import * as noConditionalStatements from "#/rules/no-conditional-statements";
import * as noLet from "#/rules/no-let";
import * as noThisExpressions from "#/rules/no-this-expressions";
import * as noThrowStatements from "#/rules/no-throw-statements";
import * as noTryStatements from "#/rules/no-try-statements";
import * as preferImmutableTypes from "#/rules/prefer-immutable-types";
import * as typeDeclarationImmutability from "#/rules/type-declaration-immutability";
import { RuleEnforcementComparator } from "#/rules/type-declaration-immutability";
import { ruleNameScope } from "#/utils/misc";

const recommended = Object.fromEntries(
  Object.entries(rules)
    .filter(
      ([, rule]) =>
        rule.meta.deprecated !== true &&
        rule.meta.docs.recommended === "recommended" &&
        rule.meta.docs.category !== "Stylistic",
    )
    .map(([name, rule]) => [`${ruleNameScope}/${name}`, rule.meta.docs.recommendedSeverity]),
) satisfies FlatConfig.Config["rules"];

const overrides = {
  [functionalParameters.fullName]: [
    "error",
    {
      enforceParameterCount: false,
      overrides: [
        {
          specifiers: [
            {
              from: "file",
            },
          ],
          options: {
            enforceParameterCount: {
              count: "atLeastOne",
              ignoreLambdaExpression: true,
              ignoreIIFE: true,
              ignoreGettersAndSetters: true,
            },
          },
        },
      ],
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
      allowToRejectPromises: true,
    },
  ],
  [noTryStatements.fullName]: "off",
  [preferImmutableTypes.fullName]: [
    "error",
    {
      enforcement: "None",
      overrides: [
        {
          specifiers: [
            {
              from: "lib",
            },
            {
              from: "package",
            },
          ],
          options: {
            ignoreInferredTypes: true,
            parameters: {
              enforcement: "ReadonlyShallow",
            },
          },
        },
        {
          specifiers: {
            from: "file",
          },
          options: {
            ignoreInferredTypes: true,
            parameters: {
              enforcement: "ReadonlyDeep",
            },
          },
        },
      ],
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
} satisfies FlatConfig.Config["rules"] as NonNullable<FlatConfig.Config["rules"]>;
