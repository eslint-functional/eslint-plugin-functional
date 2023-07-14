import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatements from "~/rules/no-expression-statements";
import * as preferImmutableTypes from "~/rules/prefer-immutable-types";
import { mergeConfigs } from "~/utils/merge-configs";

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
      { ignoreClasses: "fieldsOnly" },
    ],
    [`functional/${noConditionalStatements.name}`]: "off",
    [`functional/${noExpressionStatements.name}`]: "off",
    [`functional/${preferImmutableTypes.name}`]: [
      "error",
      {
        enforcement: "None",
        ignoreInferredTypes: true,
        parameters: {
          enforcement: "ReadonlyShallow",
        },
      },
    ],
  },
};

const config: Linter.Config = mergeConfigs(recommended, overrides);

export default config;
