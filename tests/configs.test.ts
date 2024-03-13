import { describe, expect, it } from "vitest";

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

describe("Configs", () => {
  const allRules = Object.values(rules);
  const allNonDeprecatedRules = allRules.filter(
    (rule) => rule.meta === undefined || rule.meta.deprecated !== true,
  );
  const allDeprecatedRules = allRules.filter(
    (rule) => rule.meta.deprecated === true,
  );

  const allConfigRules = Object.keys(all.rules ?? {});
  const deprecatedConfigRules = Object.keys(deprecated.rules ?? {});
  const offConfigRules = Object.entries(off.rules ?? {});

  it('"All" - should have the right number of rules', () => {
    expect(allConfigRules.length).to.equal(allNonDeprecatedRules.length);
  });

  it.each(allConfigRules)(
    '"All" - should have not have deprecated rules',
    (name) => {
      expect(
        rules[name.slice("functional/".length) as keyof typeof rules].meta
          .deprecated,
      ).to.not.equal(true, `All Config contains deprecated rule "${name}".`);
    },
  );

  it('"Deprecated" - should have the right number of rules', () => {
    expect(deprecatedConfigRules.length).to.equal(
      allDeprecatedRules.length,
      "should have every deprecated rule",
    );
  });

  it.each(deprecatedConfigRules)(
    '"Deprecated" - should have not have deprecated rules',
    (name) => {
      expect(
        rules[name.slice("functional/".length) as keyof typeof rules].meta
          .deprecated,
      ).to.equal(
        true,
        `Deprecated Config contains non-deprecated rule "${name}".`,
      );
    },
  );

  it('"Off" - should have the right number of rules', () => {
    expect(offConfigRules.length).to.equal(
      allRules.length,
      "should have every rule",
    );
  });

  it.each(offConfigRules)(
    '"Off" - should turn off all rules',
    (name, value) => {
      const severity = Array.isArray(value) ? value[0] : value;
      expect(severity).to.equal(
        "off",
        `Rule "${name}" should be turned off in the off config.`,
      );
    },
  );

  /**
   * A map of each config (except the special ones) to it's name.
   */
  const configs = [
    ["Currying", currying],
    ["Recommended", recommended],
    ["Lite", lite],
    ["Functional Strict", strict],
    ["No Exceptions", noExceptions],
    ["No Mutations", noMutations],
    ["No Other Paradigms", noOtherParadigms],
    ["No Statements", noStatements],
    ["Stylistic", stylistic],
  ] as const;

  describe.each(configs)(
    '"%s" Config rules are in the "All" Config',
    (name, config) => {
      const ruleNames = Object.keys(config.rules ?? {});

      it.each(ruleNames)(`%s`, (rule) => {
        expect(all.rules?.[rule]).toBeDefined();
      });
    },
  );
});
