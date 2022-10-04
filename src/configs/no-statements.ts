import type { Linter } from "eslint";

import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as noLoop from "~/rules/no-loop-statement";
import * as noReturnVoid from "~/rules/no-return-void";

const config: Linter.Config = {
  rules: {
    [`functional/${noConditionalStatements.name}`]: "error",
    [`functional/${noExpressionStatement.name}`]: "error",
    [`functional/${noLoop.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
  },
};

export default config;
