import type { Linter, Rule } from "eslint";

import all from "~/configs/all";
import currying from "~/configs/currying";
import externalRecommended from "~/configs/external-recommended";
import functional from "~/configs/functional";
import functionalLite from "~/configs/functional-lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import stylitic from "~/configs/stylitic";
import { rules } from "~/rules";

type EslintPluginConfig = {
  readonly rules: Record<string, Rule.RuleModule>;
  readonly configs: Record<string, Linter.Config>;
};

const config: EslintPluginConfig = {
  rules,
  configs: {
    all,
    recommended: functional,
    "external-recommended": externalRecommended,
    lite: functionalLite,
    "no-mutations": noMutations,
    "no-exceptions": noExceptions,
    "no-object-orientation": noObjectOrientation,
    "no-statements": noStatements,
    currying,
    stylitic,
  },
};

export default config;
