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

    it("doesn't report non-issues", () => {
      valid(dedent`
        function foo() {
          bar();
        }
      `);
    });

    it("reports throw statements of strings", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo() {
            throw 'error';
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports throw statements of Errors", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports throw statements in async functions", () => {
      const invalidResult = invalid({
        code: dedent`
          async function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowToRejectPromises", () => {
        it("doesn't report throw statements in async functions", () => {
          valid({
            code: dedent`
              async function foo() {
                throw new Error();
              }
            `,
            options: [{ allowToRejectPromises: true }],
          });
        });

        it("doesn't report throw statements in try without catch in async functions", () => {
          valid({
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

        it("reports throw statements in try with catch in async functions", () => {
          const invalidResult = invalid({
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
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("reports throw statements in functions nested in async functions", () => {
          const invalidResult = invalid({
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
          expect(invalidResult.messages).toMatchSnapshot();
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
        it("doesn't report throw statements in promise then handlers", () => {
          valid({
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

        it("doesn't report throw statements in promise catch handlers", () => {
          valid({
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

        it("doesn't report throw statements in promise handlers", () => {
          valid({
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
