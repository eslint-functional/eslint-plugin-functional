import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";
import * as immutableData from "~/rules/immutable-data";
import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as preferImmutableParameterTypes from "~/rules/prefer-immutable-parameter-types";
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
    [`functional/${noConditionalStatement.name}`]: "off",
    [`functional/${noExpressionStatement.name}`]: "off",
    [`functional/${preferImmutableParameterTypes.name}`]: [
      "error",
      {
        enforcement: "ReadonlyShallow",
      },
    ],
  },
};

const config: Linter.Config = mergeConfigs(recommended, overrides);

export default config;
