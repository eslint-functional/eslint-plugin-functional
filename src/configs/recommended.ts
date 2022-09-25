import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";
import { Immutability } from "is-immutable-type";

import * as functionalParameters from "~/rules/functional-parameters";
import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noLet from "~/rules/no-let";
import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";
import * as preferImmutableParameterTypes from "~/rules/prefer-immutable-parameter-types";
import { RuleEnforcementComparator } from "~/rules/type-declaration-immutability";

import strict from "./strict";

const overrides: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: [
      "error",
      {
        allowLambda: true,
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
    [`functional/${noThrowStatement.name}`]: [
      "error",
      {
        allowInAsyncFunctions: true,
      },
    ],
    [`functional/${noTryStatement.name}`]: "off",
    [`functional/${preferImmutableParameterTypes.name}`]: [
      "error",
      {
        enforcement: "ReadonlyDeep",
      },
    ],
    [`functional/${preferImmutableParameterTypes.name}`]: [
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

const config: Linter.Config = deepmerge(strict, overrides);

export default config;
