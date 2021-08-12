/**
 * @file Tests for all configs except `all`.
 */
import test from "ava";

import all from "~/configs/all";
import currying from "~/configs/currying";
import functional from "~/configs/functional";
import functionalLite from "~/configs/functional-lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import stylistic from "~/configs/stylistic";
import { rules } from "~/rules";

test('Config "All" - should have all the non-deprecated rules', (t) => {
  const allRules = Object.values(rules);
  const allNonDeprecatedRules = allRules.filter(
    (rule) => rule.meta.deprecated !== true
  );

  const configAllJSRules = Object.keys(all.rules ?? {});
  const configAllTSRules = Object.keys(all.overrides?.[0].rules ?? {});
  const configAllRules = new Set([...configAllJSRules, ...configAllTSRules]);

  t.is(configAllRules.size, allNonDeprecatedRules.length);
});

/**
 * A map of each config (except the "all" config) to it's name.
 */
const configs = new Map([
  [currying, "Currying"],
  [functional, "Functional"],
  [functionalLite, "Functional Lite"],
  [noExceptions, "No Mutations"],
  [noMutations, "No Exceptions"],
  [noObjectOrientation, "No Object Orientation"],
  [noStatements, "No Statements"],
  [stylistic, "Stylistic"],
]);

for (const [config, name] of [...configs.entries()]) {
  test(`Config "${name}" - should not have any *JS* rules that the all config does not have`, (t) => {
    const rulesNames = Object.keys(config.rules ?? {});
    if (rulesNames.length === 0) {
      t.pass("no tests");
    }
    for (const rule of rulesNames) {
      t.not(all.rules?.[rule], undefined);
    }
  });

  test(`Config "${name}" - should not have any *TS* rules that the all config does not have`, (t) => {
    const rulesNames = Object.keys(config.overrides?.[0].rules ?? {});
    if (rulesNames.length === 0) {
      t.pass("no tests");
    }
    for (const rule of rulesNames) {
      t.not(all.overrides?.[0].rules?.[rule], undefined);
    }
  });
}
