/**
 * @file Tests for all configs except `all`.
 */
import test from "ava";

import all from "~/configs/all";
import currying from "~/configs/currying";
import lite from "~/configs/lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import off from "~/configs/off";
import recommended from "~/configs/recommended";
import stylistic from "~/configs/stylistic";
import { rules } from "~/rules";

const allRules = Object.values(rules);
const allNonDeprecatedRules = allRules.filter(
  (rule) => rule.meta.deprecated !== true
);

test('Config "All" - should have all the non-deprecated rules', (t) => {
  const configAllJSRules = Object.keys(all.rules ?? {});
  const configAllTSRules = Object.keys(all.overrides?.[0].rules ?? {});
  const configAllRules = new Set([...configAllJSRules, ...configAllTSRules]);

  t.is(configAllRules.size, allNonDeprecatedRules.length);
});

test('Config "Off" - should have all the rules "All" has but turned off', (t) => {
  const configOffJSRules = Object.keys(off.rules ?? {});
  t.is(configOffJSRules.length, allNonDeprecatedRules.length);

  t.is(off.overrides, undefined, '"Off" config should not have overrides');

  for (const [name, value] of Object.entries(off.rules)) {
    const severity = Array.isArray(value) ? value[0] : value;
    t.is(
      severity,
      "off",
      `Rule "${name}"" should be turned off in the off config.`
    );
  }
});

/**
 * A map of each config (except the "all" config) to it's name.
 */
const configs = new Map([
  [currying, "Currying"],
  [recommended, "Recommended"],
  [lite, "Lite"],
  [noExceptions, "No Exceptions"],
  [noMutations, "No Mutations"],
  [noObjectOrientation, "No Object Orientation"],
  [noStatements, "No Statements"],
  [stylistic, "Stylistic"],
]);

for (const [config, name] of configs.entries()) {
  test(`Config "${name}" - should not have any *JS* rules that the all config does not have`, (t) => {
    const rulesNames = Object.keys(config.rules ?? {});
    if (rulesNames.length === 0) {
      t.pass("no tests");
    }
    for (const rule of rulesNames) {
      t.not(
        all.rules?.[rule],
        undefined,
        `"${rule}" should be in "${name}" config as not in "All" config`
      );
    }
  });

  test(`Config "${name}" - should not have any *TS* rules that the all config does not have`, (t) => {
    const rulesNames = Object.keys(config.overrides?.[0].rules ?? {});
    if (rulesNames.length === 0) {
      t.pass("no tests");
    }
    for (const rule of rulesNames) {
      t.not(
        all.overrides?.[0].rules?.[rule],
        undefined,
        `"${rule}" should be in "${name}" config as not in "All" config`
      );
    }
  });
}
