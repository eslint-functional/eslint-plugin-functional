import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noLet from "~/rules/no-let";
import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";
import * as preferImmutableParameterTypes from "~/rules/prefer-immutable-parameter-types";

import strict from "./strict";

const overrides: Linter.Config = {
  rules: {
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
  },
};

const config: Linter.Config = deepmerge(strict, overrides);

export default config;
