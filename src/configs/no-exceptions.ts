import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as noThrowStatements from "#eslint-plugin-functional/rules/no-throw-statements";
import * as noTryStatements from "#eslint-plugin-functional/rules/no-try-statements";

const config: Linter.Config = {
  rules: {
    [`functional/${noThrowStatements.name}`]: "error",
    [`functional/${noTryStatements.name}`]: "error",
  },
};

export default config;
