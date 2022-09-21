import test from "ava";

import all from "~/configs/all";
import currying from "~/configs/currying";
import deprecated from "~/configs/deprecated";
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
const allDeprecatedRules = allRules.filter(
  (rule) => rule.meta.deprecated === true
);

test('Config "All" - should have all the non-deprecated rules', (t) => {
  const configRules = Object.keys(all.rules ?? {});

  t.is(all.overrides, undefined, "should not have any overrides");
  t.is(
    configRules.length,
    allNonDeprecatedRules.length,
    "should have every non-deprecated rule"
  );

  for (const name of configRules) {
    t.is(
      Boolean(rules[name.slice("functional/".length)].meta.deprecated),
      false,
      `Rule "${name}" should not be deprecated.`
    );
  }
});

test('Config "Deprecated" - should only have deprecated rules', (t) => {
  const configRules = Object.keys(deprecated.rules ?? {});

  t.is(deprecated.overrides, undefined, "should not have any overrides");
  t.is(
    configRules.length,
    allDeprecatedRules.length,
    "should have every deprecated rule"
  );

  for (const name of configRules) {
    t.is(
      rules[name.slice("functional/".length)].meta.deprecated,
      true,
      `Rule "${name}" should be deprecated.`
    );
  }
});

test('Config "Off" - should have all the rules but turned off', (t) => {
  const configRules = Object.keys(off.rules ?? {});

  t.is(off.overrides, undefined, "should not have any overrides");
  t.is(configRules.length, allRules.length, "should have every rule");

  for (const [name, value] of Object.entries(off.rules)) {
    const severity = Array.isArray(value) ? value[0] : value;
    t.is(
      severity,
      "off",
      `Rule "${name}" should be turned off in the off config.`
    );
  }
});

/**
 * A map of each config (except the special ones) to it's name.
 */
const configs = new Map([
  [currying, "Currying"],
  [recommended, "Functional"],
  [lite, "Functional Lite"],
  [noExceptions, "No Exceptions"],
  [noMutations, "No Mutations"],
  [noObjectOrientation, "No Object Orientation"],
  [noStatements, "No Statements"],
  [stylistic, "Stylistic"],
]);

for (const [config, name] of configs.entries()) {
  test(`Config "${name}"`, (t) => {
    t.is(config.overrides, undefined, "should not have any overrides");

    const rulesNames = Object.keys(config.rules ?? {});
    if (rulesNames.length === 0) {
      t.fail("no rules");
    }
    for (const rule of rulesNames) {
      t.not(
        all.rules?.[rule],
        undefined,
        "should not have any rules that the `all` config does not have"
      );
    }
  });
}
