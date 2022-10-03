import type { Linter } from "eslint";
import { Immutability } from "is-immutable-type";

import * as functionalParameters from "~/rules/functional-parameters";
import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noLet from "~/rules/no-let";
import * as noThisExpression from "~/rules/no-this-expression";
import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";
import * as preferImmutableTypes from "~/rules/prefer-immutable-types";
import * as typeDeclarationImmutability from "~/rules/type-declaration-immutability";
import { RuleEnforcementComparator } from "~/rules/type-declaration-immutability";
import { mergeConfigs } from "~/util/merge-configs";

import strict from "./strict";

const overrides: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: [
      "error",
      {
        enforceParameterCount: {
          ignoreLambdaExpression: true,
          ignoreIIFE: true,
        },
      },
    ],
    [`functional/${noConditionalStatement.name}`]: [
      "error",
      {
        allowReturningBranches: true,
      },
    ],
    [`functional/${noLet.name}`]: [
      "error",
      {
        allowInForLoopInit: true,
      },
    ],
    [`functional/${noThisExpression.name}`]: "off",
    [`functional/${noThrowStatement.name}`]: [
      "error",
      {
        allowInAsyncFunctions: true,
      },
    ],
    [`functional/${noTryStatement.name}`]: "off",
    [`functional/${preferImmutableTypes.name}`]: [
      "error",
      {
        enforcement: "None",
        ignoreInferredTypes: true,
        parameters: "ReadonlyDeep",
      },
    ],
    [`functional/${typeDeclarationImmutability.name}`]: [
      "error",
      {
        rules: [
          {
            identifiers: [/^I?Immutable.+/u],
            immutability: Immutability.Immutable,
            comparator: RuleEnforcementComparator.AtLeast,
          },
          {
            identifiers: [/^I?ReadonlyDeep.+/u],
            immutability: Immutability.ReadonlyDeep,
            comparator: RuleEnforcementComparator.AtLeast,
          },
          {
            identifiers: [/^I?Readonly.+/u],
            immutability: Immutability.ReadonlyShallow,
            comparator: RuleEnforcementComparator.AtLeast,
          },
          {
            identifiers: [/^I?Mutable.+/u],
            immutability: Immutability.Mutable,
            comparator: RuleEnforcementComparator.AtMost,
          },
        ],
      },
    ],
  },
};

const config: Linter.Config = mergeConfigs(strict, overrides);

export default config;
