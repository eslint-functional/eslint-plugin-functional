import type { Linter } from "eslint";

import * as noConditionalStatement from "~/rules/no-conditional-statement";
import * as noExpressionStatement from "~/rules/no-expression-statement";
import * as noLoop from "~/rules/no-loop-statement";
import * as noReturnVoid from "~/rules/no-return-void";

const config: Linter.Config = {
  rules: {
    [`functional/${noConditionalStatement.name}`]: "error",
    [`functional/${noExpressionStatement.name}`]: "error",
    [`functional/${noLoop.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
  },
};

export default config;
