import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as functionalParameters from "~/rules/functional-parameters";

const config: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: "error",
  },
};

export default config;
