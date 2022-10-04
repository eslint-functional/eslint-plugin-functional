import type { Linter } from "eslint";

import * as noClasses from "~/rules/no-classes";
import * as noMixedTypes from "~/rules/no-mixed-types";
import * as noThisExpression from "~/rules/no-this-expression";

const config: Linter.Config = {
  rules: {
    [`functional/${noClasses.name}`]: "error",
    [`functional/${noMixedTypes.name}`]: "error",
    [`functional/${noThisExpression.name}`]: "error",
  },
};

export default config;
