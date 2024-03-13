import { describe, it } from "vitest";

import all from "#eslint-plugin-functional/configs/all";
import currying from "#eslint-plugin-functional/configs/currying";
import deprecated from "#eslint-plugin-functional/configs/deprecated";
import lite from "#eslint-plugin-functional/configs/lite";
import noExceptions from "#eslint-plugin-functional/configs/no-exceptions";
import noMutations from "#eslint-plugin-functional/configs/no-mutations";
import noOtherParadigms from "#eslint-plugin-functional/configs/no-other-paradigms";
import noStatements from "#eslint-plugin-functional/configs/no-statements";
import off from "#eslint-plugin-functional/configs/off";
import recommended from "#eslint-plugin-functional/configs/recommended";
import strict from "#eslint-plugin-functional/configs/strict";
import stylistic from "#eslint-plugin-functional/configs/stylistic";
import { rules } from "#eslint-plugin-functional/rules";
import { ruleNameScope } from "#eslint-plugin-functional/utils/misc";

describe("Configs", () => {
  const allRules = Object.values(rules);
  const allRuleNames = Object.keys(rules);
  const allRuleFullNames = allRuleNames.map(
    (name) => `${ruleNameScope}/${name}`,
  );
  const allNonDeprecatedRules = allRules.filter(
    (rule) => rule.meta === undefined || rule.meta.deprecated !== true,
  );
  const allDeprecatedRules = allRules.filter(
    (rule) => rule.meta.deprecated === true,
  );

  it('"All" - should have all the non-deprecated rules', (t) => {
    const configRules = Object.keys(all ?? {});

    t.expect(configRules.length).to.equal(
      allNonDeprecatedRules.length,
      "should have every non-deprecated rule",
    );

    for (const name of configRules) {
      t.expect(
        Boolean(
          rules[name.slice("functional/".length) as keyof typeof rules].meta
            .deprecated,
        ),
      ).to.equal(false, `Rule "${name}" should not be deprecated.`);
    }
  });

  it('"Deprecated" - should only have deprecated rules', (t) => {
    const configRules = Object.keys(deprecated ?? {});

    t.expect(configRules.length).to.equal(
      allDeprecatedRules.length,
      "should have every deprecated rule",
    );

    for (const name of configRules) {
      t.expect(
        rules[name.slice("functional/".length) as keyof typeof rules].meta
          .deprecated,
      ).to.equal(true, `Rule "${name}" should be deprecated.`);
    }
  });

  it('"Off" - should have all the rules but turned off', (t) => {
    const configRules = Object.entries(off ?? {});
    t.expect(configRules.length).to.equal(
      allRules.length,
      "should have every rule",
    );

    for (const [name, value] of configRules) {
      const severity: string = Array.isArray(value) ? value[0] : value;
      t.expect(severity).to.equal(
        "off",
        `Rule "${name}" should be turned off in the off config.`,
      );
    }
  });

  /**
   * A map of each config (except the special ones) to it's name.
   */
  const configs = [
    [currying, "Currying"],
    [recommended, "Recommended"],
    [lite, "Lite"],
    [strict, "Functional Strict"],
    [noExceptions, "No Exceptions"],
    [noMutations, "No Mutations"],
    [noOtherParadigms, "No Other Paradigms"],
    [noStatements, "No Statements"],
    [stylistic, "Stylistic"],
  ] as const;

  for (const [config, name] of configs) {
    it(`Config "${name}"`, (t) => {
      const rulesNames = Object.keys(config ?? {});
      if (rulesNames.length === 0) {
        t.expect.fail("no rules");
      }
      for (const rule of rulesNames) {
        t.expect(allRuleFullNames).toContain(rule);
      }
    });
  }
});
