import type { Linter } from "eslint";

import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatements from "~/rules/no-expression-statements";
import * as noLoop from "~/rules/no-loop-statement";
import * as noReturnVoid from "~/rules/no-return-void";

const config: Linter.Config = {
  rules: {
    [`functional/${noConditionalStatements.name}`]: "error",
    [`functional/${noExpressionStatements.name}`]: "error",
    [`functional/${noLoop.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
  },
};

export default config;
