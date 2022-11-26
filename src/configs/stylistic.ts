import type { Linter } from "eslint";

import * as preferPropertySignatures from "~/rules/prefer-property-signatures";
import * as preferTacit from "~/rules/prefer-tacit";
import * as readonlyType from "~/rules/readonly-type";

const config: Linter.Config = {
  rules: {
    [`functional/${preferPropertySignatures.name}`]: "error",
    [`functional/${preferTacit.name}`]: [
      "warn",
      { assumeTypes: { allowFixer: false } },
    ],
    [`functional/${readonlyType.name}`]: "error",
  },
};

export default config;
