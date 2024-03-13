import {
  type ClassicConfig,
  type FlatConfig,
  type Linter,
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
  },
  rules,
} satisfies Omit<FlatConfig.Plugin, "configs">;

const createConfig = (
  rules: NonNullable<FlatConfig.Config["rules"]>,
  isLegacyConfig = false,
) =>
  isLegacyConfig
    ? ({ plugins: [ruleNameScope], rules } satisfies ClassicConfig.Config)
    : ({ plugins: { functional }, rules } satisfies FlatConfig.Config);

const configs = Object.fromEntries(
  (
    [
      [false, "flat/"],
      [true, ""],
    ] as Array<[boolean, string]>
  ).flatMap(
    ([isLegacyConfig, prefix]): Array<
      [string, FlatConfig.Config | ClassicConfig.Config]
    > => [
      [`${prefix}all`, createConfig(all, isLegacyConfig)],
      [`${prefix}lite`, createConfig(lite, isLegacyConfig)],
      [`${prefix}recommended`, createConfig(recommended, isLegacyConfig)],
      [`${prefix}strict`, createConfig(strict, isLegacyConfig)],
      [`${prefix}off`, createConfig(off, isLegacyConfig)],
      [
        `${prefix}disable-type-checked`,
        createConfig(disableTypeChecked, isLegacyConfig),
      ],
      [
        `${prefix}external-vanilla-recommended`,
        createConfig(externalVanillaRecommended, isLegacyConfig),
      ],
      [
        `${prefix}external-typescript-recommended`,
        createConfig(externalTypeScriptRecommended, isLegacyConfig),
      ],
      [`${prefix}currying`, createConfig(currying, isLegacyConfig)],
      [`${prefix}no-exceptions`, createConfig(noExceptions, isLegacyConfig)],
      [`${prefix}no-mutations`, createConfig(noMutations, isLegacyConfig)],
      [
        `${prefix}no-other-paradigms`,
        createConfig(noOtherParadigms, isLegacyConfig),
      ],
      [`${prefix}no-statements`, createConfig(noStatements, isLegacyConfig)],
      [`${prefix}stylistic`, createConfig(stylistic, isLegacyConfig)],
    ],
  ),
) satisfies Record<string, FlatConfig.Config | ClassicConfig.Config>;

export default {
  ...functional,
  configs,
} as Linter.Plugin;
