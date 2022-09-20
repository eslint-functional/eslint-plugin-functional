import type { Linter } from "eslint";

import * as functionalParameters from "~/rules/functional-parameters";

const config: Linter.Config = {
  rules: {
    [`functional/${functionalParameters.name}`]: "error",
  },
};

export default config;
