import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import * as preferPropertySignatures from "~/rules/prefer-property-signatures";
import * as preferTacit from "~/rules/prefer-tacit";
import * as readonlyType from "~/rules/readonly-type";

const config: Linter.Config = {
  rules: {
    [`functional/${preferPropertySignatures.name}`]: "error",
    [`functional/${preferTacit.name}`]: ["warn", { assumeTypes: true }],
    [`functional/${readonlyType.name}`]: "error",
  },
};

export default config;
