/**
 * @file Tests for all configs except `all`.
 */

import all from "../src/configs/all";
import currying from "../src/configs/currying";
import functional from "../src/configs/functional";
import functionalLite from "../src/configs/functional-lite";
import noMutations from "../src/configs/no-mutations";
import noExceptions from "../src/configs/no-exceptions";
import noObjectOrientation from "../src/configs/no-object-orientation";
import noStatements from "../src/configs/no-statements";
import { rules } from "../src/rules";
import { Config } from "../src/util/misc";

/**
 * Test the given config.
 */
function testConfig(config: Config, master: Config) {
  return () => {
    it("should not have any JS rules that the all config does not have", () => {
      if (config.rules) {
        Object.keys(config.rules).every((rule) => {
          expect(master.rules[rule]).toBeDefined();
        });
      }
    });

    it("should not have any TS rules that the all config does not have", () => {
      if (config.overrides) {
        Object.keys(config.overrides[0].rules).every((rule) => {
          expect(master.overrides[0].rules[rule]).toBeDefined();
        });
      }
    });
  };
}

describe("configs", () => {
  describe("All", () => {
    const allRules = Object.keys(rules);
    const configJSRules = Object.keys(all.rules);
    const configTSRules = Object.keys(all.overrides[0].rules);

    it("should have all the rules", () => {
      expect([...configJSRules, ...configTSRules]).toHaveLength(
        allRules.length
      );
    });
  });

  describe("Currying", testConfig(currying, all));
  describe("Functional", testConfig(functional, all));
  describe("Functional Lite", testConfig(functionalLite, all));
  describe("No Mutations", testConfig(noMutations, all));
  describe("No Exceptions", testConfig(noExceptions, all));
  describe("No Object Orientation", testConfig(noObjectOrientation, all));
  describe("No Statements", testConfig(noStatements, all));
});
