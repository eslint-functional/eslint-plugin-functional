import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as noTryStatement from "~/rules/no-try-statement";

import recommended from "./recommended";

const overrides: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: [
      "error",
      {
        enforceParameterCount: false,
      },
    ],
    [`functional/${immutableData.name}`]: [
      "error",
      { ignoreClass: "fieldsOnly" },
    ],
    [`functional/${noConditionalStatement.name}`]: "off",
    [`functional/${noExpressionStatement.name}`]: "off",
    [`functional/${noTryStatement.name}`]: "off",
  },
};

const config: Linter.Config = deepmerge(recommended, overrides);

export default config;
