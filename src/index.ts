import type { Linter, Rule } from "eslint";

import all from "~/configs/all";
import currying from "~/configs/currying";
import externalTypeScriptRecommended from "~/configs/external-typescript-recommended";
import externalVanillaRecommended from "~/configs/external-vanilla-recommended";
import lite from "~/configs/lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import off from "~/configs/off";
import recommended from "~/configs/recommended";
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
    lite,
    recommended,
    off,
    "external-vanilla-recommended": externalVanillaRecommended,
    "external-typescript-recommended": externalTypeScriptRecommended,
    currying,
    "no-exceptions": noExceptions,
    "no-mutations": noMutations,
    "no-object-orientation": noObjectOrientation,
    "no-statements": noStatements,
    stylistic,
  },
};

export default config;
