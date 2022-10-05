import type { Linter } from "eslint";

import all from "./all";
import deprecated from "./deprecated";

/**
 * Turn the given rules off.
 */
function turnRulesOff(rules: string[]): Linter.Config["rules"] {
  return rules === undefined
    ? undefined
    : Object.fromEntries(rules.map((name) => [name, "off"]));
}

const allRulesNames = new Set([
  ...Object.keys(all.rules ?? {}),
  ...Object.keys(deprecated.rules ?? {}),
]);

const config: Linter.Config = {
  rules: turnRulesOff([...allRulesNames]),
};

export default config;
