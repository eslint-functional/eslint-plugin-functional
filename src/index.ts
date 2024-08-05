import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

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
  version: __VERSION__ as string,
} as const;

const functional = {
  meta,
  rules,
} satisfies FlatConfig.Plugin;

const plugins = { functional } as const;

const configs: Readonly<{
  all: FlatConfig.Config;
  lite: FlatConfig.Config;
  recommended: FlatConfig.Config;
  strict: FlatConfig.Config;
  off: FlatConfig.Config;
  disableTypeChecked: FlatConfig.Config;
  externalVanillaRecommended: FlatConfig.Config;
  externalTypeScriptRecommended: FlatConfig.Config;
  currying: FlatConfig.Config;
  noExceptions: FlatConfig.Config;
  noMutations: FlatConfig.Config;
  noOtherParadigms: FlatConfig.Config;
  noStatements: FlatConfig.Config;
  stylistic: FlatConfig.Config;
}> = {
  all: { plugins, rules: all },
  lite: { plugins, rules: lite },
  recommended: { plugins, rules: recommended },
  strict: { plugins, rules: strict },
  off: { plugins, rules: off },
  disableTypeChecked: {
    plugins,
    rules: disableTypeChecked,
  },
  externalVanillaRecommended: {
    plugins,
    rules: externalVanillaRecommended,
  },
  externalTypeScriptRecommended: {
    plugins,
    rules: externalTypeScriptRecommended,
  },
  currying: { plugins, rules: currying },
  noExceptions: { plugins, rules: noExceptions },
  noMutations: { plugins, rules: noMutations },
  noOtherParadigms: {
    plugins,
    rules: noOtherParadigms,
  },
  noStatements: { plugins, rules: noStatements },
  stylistic: { plugins, rules: stylistic },
} satisfies Record<string, FlatConfig.Config>;

type EslintPluginFunctional = FlatConfig.Plugin & {
  meta: typeof meta;
  rules: typeof rules;
  configs: typeof configs;
};

// eslint-disable-next-line functional/immutable-data
(functional as EslintPluginFunctional).configs = configs;

export default functional as EslintPluginFunctional;
