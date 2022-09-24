import type { Linter } from "eslint";

import * as noClass from "~/rules/no-class";
import * as noMixedType from "~/rules/no-mixed-type";
import * as noThisExpression from "~/rules/no-this-expression";

const config: Linter.Config = {
  rules: {
    [`functional/${noClass.name}`]: "error",
    [`functional/${noMixedType.name}`]: "error",
    [`functional/${noThisExpression.name}`]: "error",
  },
};

export default config;
