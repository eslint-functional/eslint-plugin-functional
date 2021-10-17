import type { Linter } from "eslint";

import all from "./all";

function turnRulesOff(rules: Linter.Config["rules"]): Linter.Config["rules"] {
  return rules === undefined
    ? undefined
    : Object.fromEntries(
        Object.entries(rules).map(([name, value]) => [name, "off"])
      );
}

const config: Linter.Config = {
  rules: turnRulesOff(all.rules),
  overrides: all.overrides?.map((override) => ({
    ...override,
    rules: turnRulesOff(override.rules),
  })),
};

export default config;
