import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as noConditionalStatements from "#eslint-plugin-functional/rules/no-conditional-statements";
import * as noExpressionStatements from "#eslint-plugin-functional/rules/no-expression-statements";
import * as noLoopStatements from "#eslint-plugin-functional/rules/no-loop-statements";
import * as noReturnVoid from "#eslint-plugin-functional/rules/no-return-void";

const config: Linter.Config = {
  rules: {
    [`functional/${noConditionalStatements.name}`]: "error",
    [`functional/${noExpressionStatements.name}`]: "error",
    [`functional/${noLoopStatements.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
  },
};

export default config;
