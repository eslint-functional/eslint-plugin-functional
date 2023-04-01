import type { Linter } from "@typescript-eslint/utils/ts-eslint";

import all from "./all";
import deprecated from "./deprecated";

/**
 * Turn the given rules off.
 */
function turnRulesOff(rules: string[]): NonNullable<Linter.Config["rules"]> {
  return Object.fromEntries(rules.map((name) => [name, "off"]));
}

const allRulesNames = new Set([
  ...Object.keys(all.rules ?? {}),
  ...Object.keys(deprecated.rules ?? {}),
]);

const config: Linter.Config = {
  rules: turnRulesOff([...allRulesNames]),
};

export default config;
