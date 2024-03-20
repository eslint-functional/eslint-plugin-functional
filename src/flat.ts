import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import all from "#eslint-plugin-functional/configs/all";
import currying from "#eslint-plugin-functional/configs/currying";
import disableTypeChecked from "#eslint-plugin-functional/configs/disable-type-checked";
import externalTypeScriptRecommended from "#eslint-plugin-functional/configs/external-typescript-recommended";
import externalVanillaRecommended from "#eslint-plugin-functional/configs/external-vanilla-recommended";
import lite from "#eslint-plugin-functional/configs/lite";
import noExceptions from "#eslint-plugin-functional/configs/no-exceptions";
import noMutations from "#eslint-plugin-functional/configs/no-mutations";
import noOtherParadigms from "#eslint-plugin-functional/configs/no-other-paradigms";
import noStatements from "#eslint-plugin-functional/configs/no-statements";
import off from "#eslint-plugin-functional/configs/off";
import recommended from "#eslint-plugin-functional/configs/recommended";
import strict from "#eslint-plugin-functional/configs/strict";
import stylistic from "#eslint-plugin-functional/configs/stylistic";
import { rules } from "#eslint-plugin-functional/rules";
import { __VERSION__ } from "#eslint-plugin-functional/utils/constants";

const functional = {
  meta: {
    name: "eslint-plugin-functional",
    version: __VERSION__,
  } as const,
  rules,
} satisfies Omit<FlatConfig.Plugin, "configs">;

const configs = {
  all: { plugins: { functional }, rules: all },
  lite: { plugins: { functional }, rules: lite },
  recommended: { plugins: { functional }, rules: recommended },
  strict: { plugins: { functional }, rules: strict },
  off: { plugins: { functional }, rules: off },
  disableTypeChecked: {
    plugins: { functional },
    rules: disableTypeChecked,
  },
  externalVanillaRecommended: {
    plugins: { functional },
    rules: externalVanillaRecommended,
  },
  externalTypescriptRecommended: {
    plugins: { functional },
    rules: externalTypeScriptRecommended,
  },
  currying: { plugins: { functional }, rules: currying },
  noExceptions: { plugins: { functional }, rules: noExceptions },
  noMutations: { plugins: { functional }, rules: noMutations },
  noOtherParadigms: {
    plugins: { functional },
    rules: noOtherParadigms,
  },
  noStatements: { plugins: { functional }, rules: noStatements },
  stylistic: { plugins: { functional }, rules: stylistic },
} satisfies Record<string, FlatConfig.Config>;

export default {
  ...functional,
  configs,
} as const;
