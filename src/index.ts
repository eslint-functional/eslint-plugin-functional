import {
  type ClassicConfig,
  type FlatConfig,
} from "@typescript-eslint/utils/ts-eslint";

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
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

const functional = {
  meta: {
    name: "eslint-plugin-functional",
    version: __VERSION__,
  } as const,
  rules,
} satisfies Omit<FlatConfig.Plugin, "configs">;

const classicConfigs = {
  all: { plugins: [ruleNameScope], rules: all },
  lite: { plugins: [ruleNameScope], rules: lite },
  recommended: { plugins: [ruleNameScope], rules: recommended },
  strict: { plugins: [ruleNameScope], rules: strict },
  off: { plugins: [ruleNameScope], rules: off },
  "disable-type-checked": {
    plugins: [ruleNameScope],
    rules: disableTypeChecked,
  },
  "external-vanilla-recommended": {
    plugins: [ruleNameScope],
    rules: externalVanillaRecommended,
  },
  "external-typescript-recommended": {
    plugins: [ruleNameScope],
    rules: externalTypeScriptRecommended,
  },
  currying: { plugins: [ruleNameScope], rules: currying },
  "no-exceptions": { plugins: [ruleNameScope], rules: noExceptions },
  "no-mutations": { plugins: [ruleNameScope], rules: noMutations },
  "no-other-paradigms": { plugins: [ruleNameScope], rules: noOtherParadigms },
  "no-statements": { plugins: [ruleNameScope], rules: noStatements },
  stylistic: { plugins: [ruleNameScope], rules: stylistic },
} satisfies Record<string, ClassicConfig.Config>;

const flatConfigs = {
  "flat/all": { plugins: { functional }, rules: all },
  "flat/lite": { plugins: { functional }, rules: lite },
  "flat/recommended": { plugins: { functional }, rules: recommended },
  "flat/strict": { plugins: { functional }, rules: strict },
  "flat/off": { plugins: { functional }, rules: off },
  "flat/disable-type-checked": {
    plugins: { functional },
    rules: disableTypeChecked,
  },
  "flat/external-vanilla-recommended": {
    plugins: { functional },
    rules: externalVanillaRecommended,
  },
  "flat/external-typescript-recommended": {
    plugins: { functional },
    rules: externalTypeScriptRecommended,
  },
  "flat/currying": { plugins: { functional }, rules: currying },
  "flat/no-exceptions": { plugins: { functional }, rules: noExceptions },
  "flat/no-mutations": { plugins: { functional }, rules: noMutations },
  "flat/no-other-paradigms": {
    plugins: { functional },
    rules: noOtherParadigms,
  },
  "flat/no-statements": { plugins: { functional }, rules: noStatements },
  "flat/stylistic": { plugins: { functional }, rules: stylistic },
} satisfies Record<string, FlatConfig.Config>;

export default {
  ...functional,
  configs: {
    ...(flatConfigs as Record<keyof typeof flatConfigs, FlatConfig.Config>),
    ...(classicConfigs as Record<
      keyof typeof classicConfigs,
      ClassicConfig.Config
    >),
  } as const,
} as const;
