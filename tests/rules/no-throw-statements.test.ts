import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-throw-statements";

import { esLatestConfig, typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", async () => {
      await valid(dedent`
        function foo() {
          bar();
        }
      `);
    });

    it("reports throw statements of strings", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo() {
            throw 'error';
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports throw statements of Errors", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports throw statements in async functions", async () => {
      const invalidResult = await invalid({
        code: dedent`
          async function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowToRejectPromises", () => {
        it("doesn't report throw statements in async functions", async () => {
          await valid({
            code: dedent`
              async function foo() {
                throw new Error();
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });

        it("doesn't report throw statements in try without catch in async functions", async () => {
          await valid({
            code: dedent`
              async function foo() {
                try {
                  throw new Error("hello");
                } finally {
                  console.log("world");
                }
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });

        it("reports throw statements in try with catch in async functions", async () => {
          const invalidResult = await invalid({
            code: dedent`
              async function foo() {
                try {
                  throw new Error("hello world");
                } catch (e) {
                  console.log(e);
                }
              }
            `,
            errors: ["generic"],
            options: [{ allowToRejectPromises: true }],
          });
          expect(invalidResult.result).toMatchSnapshot();
        });

        it("reports throw statements in functions nested in async functions", async () => {
          const invalidResult = await invalid({
            code: dedent`
              async function foo() {
                function bar() {
                  throw new Error();
                }
              }
            `,
            errors: ["generic"],
            options: [{ allowToRejectPromises: true }],
          });
          expect(invalidResult.result).toMatchSnapshot();
        });
      });
    });
  });

  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    describe("options", () => {
      describe("allowToRejectPromises", () => {
        it("doesn't report throw statements in promise then handlers", async () => {
          await valid({
            code: dedent`
              function foo() {
                Promise.resolve().then(() => {
                  throw new Error();
                });
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });

        it("doesn't report throw statements in promise catch handlers", async () => {
          await valid({
            code: dedent`
              function foo() {
                Promise.resolve().catch(() => {
                  throw new Error();
                });
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });

        it("doesn't report throw statements in promise handlers", async () => {
          await valid({
            code: dedent`
              function foo() {
                Promise.resolve().then(() => {
                  throw new Error();
                }, () => {
                  throw new Error();
                });
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });
      });
    });
  });
});
