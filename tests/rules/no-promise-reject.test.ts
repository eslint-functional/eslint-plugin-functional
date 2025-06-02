import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-promise-reject";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("reports Promise.reject", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo() {
            return Promise.reject("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("reports new Promise(reject)", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo() {
            return new Promise((resolve, reject) => {
              reject("hello world");
            });
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("reports throw in async functions", async () => {
      const invalidResult = await invalid({
        code: dedent`
          async function foo() {
            throw new Error("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("reports throw in try without catch in async functions", async () => {
      const invalidResult = await invalid({
        code: dedent`
          async function foo() {
            try {
              throw new Error("hello");
            } finally {
              console.log("world");
            }
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("doesn't report Promise.resolve", async () => {
      await valid({
        code: dedent`
          function foo() {
            return Promise.resolve("hello world");
          }
        `,
      });
    });

    it("doesn't report new Promise(resolve)", async () => {
      await valid({
        code: dedent`
          function foo() {
            return new Promise((resolve) => {
              resolve("hello world");
            });
          }
        `,
      });
    });

    it("doesn't report throw in try in async functions", async () => {
      await valid({
        code: dedent`
          async function foo() {
            try {
              throw new Error("hello world");
            } catch (e) {
              console.log(e);
            }
          }
        `,
      });
    });
  });
});
