import type { Linter, Rule } from "eslint";

import all from "~/configs/all";
import currying from "~/configs/currying";
import externalTypeScriptRecommended from "~/configs/external-typescript-recommended";
import externalVanillaRecommended from "~/configs/external-vanilla-recommended";
import functional from "~/configs/functional";
import functionalLite from "~/configs/functional-lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import off from "~/configs/off";
import stylistic from "~/configs/stylistic";
import { rules } from "~/rules";

/**
 * The config type object ESLint is expecting.
 */
type EslintPluginConfig = {
  rules: Record<string, Rule.RuleModule>;
  configs: Record<string, Linter.Config>;
};

const config: EslintPluginConfig = {
  rules,
  configs: {
    all,
    recommended: functional,
    "external-vanilla-recommended": externalVanillaRecommended,
    "external-typescript-recommended": externalTypeScriptRecommended,
    lite: functionalLite,
    off,
    "no-mutations": noMutations,
    "no-exceptions": noExceptions,
    "no-object-orientation": noObjectOrientation,
    "no-statements": noStatements,
    currying,
    stylistic,
  },
};

export default config;
