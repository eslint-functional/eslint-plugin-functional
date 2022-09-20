import type { Linter } from "eslint";

import * as noThrowStatement from "~/rules/no-throw-statement";
import * as noTryStatement from "~/rules/no-try-statement";

const config: Linter.Config = {
  rules: {
    [`functional/${noThrowStatement.name}`]: "error",
    [`functional/${noTryStatement.name}`]: "error",
  },
};

export default config;
