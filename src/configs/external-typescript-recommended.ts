import { type Linter } from "@typescript-eslint/utils/ts-eslint";

import externalVanillaRecommended from "#eslint-plugin-functional/configs/external-vanilla-recommended";
import { mergeConfigs } from "#eslint-plugin-functional/utils/merge-configs";

const tsConfig: Linter.Config = {
  rules: {
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
};

const fullConfig: Linter.Config = mergeConfigs(
  externalVanillaRecommended,
  tsConfig,
);

export default fullConfig;
