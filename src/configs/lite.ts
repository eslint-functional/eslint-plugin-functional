import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as preferImmutableTypes from "~/rules/prefer-immutable-types";
import { mergeConfigs } from "~/util/merge-configs";

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
    [`functional/${noConditionalStatements.name}`]: "off",
    [`functional/${noExpressionStatement.name}`]: "off",
    [`functional/${preferImmutableTypes.name}`]: [
      "error",
      {
        enforcement: "None",
        ignoreInferredTypes: true,
        parameters: "ReadonlyShallow",
      },
    ],
  },
};

const config: Linter.Config = mergeConfigs(recommended, overrides);

export default config;
