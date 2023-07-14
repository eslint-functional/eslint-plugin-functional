import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as noThrowStatements from "~/rules/no-throw-statements";
import * as noTryStatements from "~/rules/no-try-statements";

const config: Linter.Config = {
  rules: {
    [`functional/${noThrowStatements.name}`]: "error",
    [`functional/${noTryStatements.name}`]: "error",
  },
};

export default config;
