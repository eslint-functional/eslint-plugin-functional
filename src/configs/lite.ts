import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "#eslint-plugin-functional/rules/functional-parameters";
import * as immutableData from "#eslint-plugin-functional/rules/immutable-data";
import * as noConditionalStatements from "#eslint-plugin-functional/rules/no-conditional-statements";
import * as noExpressionStatements from "#eslint-plugin-functional/rules/no-expression-statements";
import * as preferImmutableTypes from "#eslint-plugin-functional/rules/prefer-immutable-types";
import { mergeConfigs } from "#eslint-plugin-functional/utils/merge-configs";

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
