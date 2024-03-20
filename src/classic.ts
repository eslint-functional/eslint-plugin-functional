import { type Linter } from "@typescript-eslint/utils/ts-eslint";

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
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

export default {
  rules,
  configs: {
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
  },
} as Linter.Plugin;
