import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as noConditionalStatements from "~/rules/no-conditional-statements";
import * as noExpressionStatements from "~/rules/no-expression-statements";
import * as noLoopStatements from "~/rules/no-loop-statements";
import * as noReturnVoid from "~/rules/no-return-void";

const config: Linter.Config = {
  rules: {
    [`functional/${noConditionalStatements.name}`]: "error",
    [`functional/${noExpressionStatements.name}`]: "error",
    [`functional/${noLoopStatements.name}`]: "error",
    [`functional/${noReturnVoid.name}`]: "error",
  },
};

export default config;
