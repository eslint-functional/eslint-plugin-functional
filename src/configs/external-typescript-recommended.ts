import type { Linter } from "eslint";

import externalVanillaRecommended from "~/configs/external-vanilla-recommended";
import { mergeConfigs } from "~/util/merge-configs";

const tsConfig: Linter.Config = {
  rules: {
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
};

const fullConfig: Linter.Config = mergeConfigs(
  externalVanillaRecommended,
  tsConfig
);

export default fullConfig;
