import type { Linter } from "eslint";

import * as preferPropertySignatures from "~/rules/prefer-property-signatures";
import * as preferTacit from "~/rules/prefer-tacit";

const config: Linter.Config = {
  rules: {
    [`functional/${preferPropertySignatures.name}`]: "error",
    [`functional/${preferTacit.name}`]: [
      "warn",
      { assumeTypes: { allowFixer: false } },
    ],
  },
};

export default config;
