import type { Linter } from "eslint";

import * as noClasses from "~/rules/no-classes";
import * as noMixedType from "~/rules/no-mixed-type";
import * as noThisExpression from "~/rules/no-this-expression";

const config: Linter.Config = {
  rules: {
    [`functional/${noClasses.name}`]: "error",
    [`functional/${noMixedType.name}`]: "error",
    [`functional/${noThisExpression.name}`]: "error",
  },
};

export default config;
