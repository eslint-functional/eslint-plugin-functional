import type { Linter } from "eslint";

import * as preferReadonlyType from "~/rules/prefer-readonly-type";

const config: Linter.Config = {
  rules: {
    [`functional/${preferReadonlyType.name}`]: "warn",
  },
};

export default config;
