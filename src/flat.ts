import { type FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import all from "#/configs/all";
import currying from "#/configs/currying";
import disableTypeChecked from "#/configs/disable-type-checked";
import externalTypeScriptRecommended from "#/configs/external-typescript-recommended";
import externalVanillaRecommended from "#/configs/external-vanilla-recommended";
import lite from "#/configs/lite";
import noExceptions from "#/configs/no-exceptions";
import noMutations from "#/configs/no-mutations";
import noOtherParadigms from "#/configs/no-other-paradigms";
import noStatements from "#/configs/no-statements";
import off from "#/configs/off";
import recommended from "#/configs/recommended";
import strict from "#/configs/strict";
import stylistic from "#/configs/stylistic";
import { rules } from "#/rules";
import { __VERSION__ } from "#/utils/constants";

const meta = {
  name: "eslint-plugin-functional",
  version: __VERSION__,
} as const;

const functional: FlatConfig.Plugin = {
  meta,
  rules,
};

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

// eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
functional.configs = configs;

export default functional as FlatConfig.Plugin & {
  meta: typeof meta;
  rules: typeof rules;
  configs: typeof configs;
};
