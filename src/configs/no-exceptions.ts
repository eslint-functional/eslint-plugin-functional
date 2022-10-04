import type { Linter } from "eslint";

import * as noThrowStatements from "~/rules/no-throw-statements";
import * as noTryStatement from "~/rules/no-try-statement";

const config: Linter.Config = {
  rules: {
    [`functional/${noThrowStatements.name}`]: "error",
    [`functional/${noTryStatement.name}`]: "error",
  },
};

export default config;
