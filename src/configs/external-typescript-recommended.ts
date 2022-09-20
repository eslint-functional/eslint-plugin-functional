import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import externalVanillaRecommended from "~/configs/external-vanilla-recommended";

const tsConfig: Linter.Config = {
  rules: {
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
};

const fullConfig: Linter.Config = deepmerge(
  externalVanillaRecommended,
  tsConfig
);

export default fullConfig;
