import type { Linter } from "eslint";

import all from "./all";

function turnRulesOff(rules: ReadonlyArray<string>): Linter.Config["rules"] {
  return rules === undefined
    ? undefined
    : Object.fromEntries(rules.map((name) => [name, "off"]));
}

const allRulesNames = new Set([
  ...Object.keys(all.rules ?? {}),
  ...(all.overrides?.flatMap((override) => Object.keys(override.rules ?? {})) ??
    []),
]);

const config: Linter.Config = {
  rules: turnRulesOff([...allRulesNames]),
};

export default config;
