import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as preferReadonlyType from "#eslint-plugin-functional/rules/prefer-readonly-type";

const config: Linter.Config = {
  rules: {
    [`functional/${preferReadonlyType.name}`]: "warn",
  },
};

export default config;
