import type { Linter } from "eslint";

import * as noClasses from "~/rules/no-classes";
import * as noMixedTypes from "~/rules/no-mixed-types";
import * as noThisExpressions from "~/rules/no-this-expressions";

const config: Linter.Config = {
  rules: {
    [`functional/${noClasses.name}`]: "error",
    [`functional/${noMixedTypes.name}`]: "error",
    [`functional/${noThisExpressions.name}`]: "error",
  },
};

export default config;
