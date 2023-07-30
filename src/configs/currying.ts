import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "#eslint-plugin-functional/rules/functional-parameters";

const config: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: "error",
  },
};

export default config;
