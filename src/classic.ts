import { type Linter } from "@typescript-eslint/utils/ts-eslint";

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
import { ruleNameScope } from "#/utils/misc";

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
