/**
 * @file Tests for all configs except `all`.
 */
import type { Linter } from "eslint";

import all from "~/configs/all";
import currying from "~/configs/currying";
import functional from "~/configs/functional";
import functionalLite from "~/configs/functional-lite";
import noExceptions from "~/configs/no-exceptions";
import noMutations from "~/configs/no-mutations";
import noObjectOrientation from "~/configs/no-object-orientation";
import noStatements from "~/configs/no-statements";
import stylitic from "~/configs/stylitic";
import { rules } from "~/rules";

/**
 * Test the given config.
 */
function testConfig(config: Linter.Config, master: Linter.Config) {
  return () => {
    it("should not have any JS rules that the all config does not have", () => {
      expect.hasAssertions();
      expect(config).not.toStrictEqual(master);
      Object.keys(config.rules ?? {}).forEach((rule) => {
        expect(master.rules?.[rule]).toBeDefined();
      });
    });

    it("should not have any TS rules that the all config does not have", () => {
      expect.hasAssertions();
      expect(config).not.toStrictEqual(master);
      Object.keys(config.overrides?.[0].rules ?? {}).forEach((rule) => {
        expect(master.overrides?.[0].rules?.[rule]).toBeDefined();
      });
    });
  };
}

describe("configs", () => {
  describe("All", () => {
    const allRules = Object.keys(rules);
    const configJSRules = Object.keys(all.rules ?? {});
    const configTSRules = Object.keys(all.overrides?.[0].rules ?? {});

    it("should have all the rules", () => {
      expect.assertions(1);
      expect(new Set([...configJSRules, ...configTSRules]).size).toBe(
        allRules.length
      );
    });
  });

  /* eslint-disable jest/valid-describe */
  describe("Currying", testConfig(currying, all));
  describe("Functional", testConfig(functional, all));
  describe("Functional Lite", testConfig(functionalLite, all));
  describe("No Mutations", testConfig(noMutations, all));
  describe("No Exceptions", testConfig(noExceptions, all));
  describe("No Object Orientation", testConfig(noObjectOrientation, all));
  describe("No Statements", testConfig(noStatements, all));
  describe("Stylitic", testConfig(stylitic, all));
  /* eslint-enable jest/valid-describe */
});
