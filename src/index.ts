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

const config: Linter.Plugin = {
  rules,
  configs: {
    all,
    lite,
    recommended,
    strict,
    off,
    "disable-type-checked": disableTypeChecked,
    "external-vanilla-recommended": externalVanillaRecommended,
    "external-typescript-recommended": externalTypeScriptRecommended,
    currying,
    "no-exceptions": noExceptions,
    "no-mutations": noMutations,
    "no-other-paradigms": noOtherParadigms,
    "no-statements": noStatements,
    stylistic,
  },
};

export default config;
