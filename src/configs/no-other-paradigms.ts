import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as noClasses from "#eslint-plugin-functional/rules/no-classes";
import * as noMixedTypes from "#eslint-plugin-functional/rules/no-mixed-types";
import * as noThisExpressions from "#eslint-plugin-functional/rules/no-this-expressions";

const config: Linter.Config = {
  rules: {
    [`functional/${noClasses.name}`]: "error",
    [`functional/${noMixedTypes.name}`]: "error",
    [`functional/${noThisExpressions.name}`]: "error",
  },
};

export default config;
