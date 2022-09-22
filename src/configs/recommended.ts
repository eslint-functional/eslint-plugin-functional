import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noLet from "~/rules/no-let";
import * as noThrowStatement from "~/rules/no-throw-statement";

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
  },
};

const config: Linter.Config = deepmerge(strict, overrides);

export default config;
