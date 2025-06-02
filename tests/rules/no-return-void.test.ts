import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-return-void";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("doesn't report non-void returning functions", async () => {
      await valid({
        code: dedent`
          function foo(bar: number): number {
            return bar + 1;
          }
        `,
      });
    });

    it("doesn't report non-void returning functions with inferred return type", async () => {
      await valid({
        code: dedent`
          function foo(bar: number) {
            return bar + 1;
          }
        `,
      });
    });

    it("reports void returning functions", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(bar: number): void {
            console.log(bar);
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("reports void returning functions with inferred return type", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(bar: number) {
            console.log(bar);
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowNull", () => {
        it("doesn't report null returning functions when allowed", async () => {
          await valid({
            code: dedent`
              function foo(bar: number): null {
                return null;
              }
            `,
            options: [{ allowNull: true }],
          });
        });

        it("doesn't report null returning functions with inferred return type when allowed", async () => {
          await valid({
            code: dedent`
              function foo(bar: number) {
                return null;
              }
            `,
            options: [{ allowNull: true }],
          });
        });

        it("reports null returning functions when disallowed", async () => {
          const invalidResult = await invalid({
            code: dedent`
              function foo(bar: number): null {
                return null;
              }
            `,
            options: [{ allowNull: false }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });

        it("reports null returning functions with inferred return type when disallowed", async () => {
          const invalidResult = await invalid({
            code: dedent`
              function foo(bar: number) {
                return null;
              }
            `,
            options: [{ allowNull: false }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });
      });

      describe("allowUndefined", () => {
        it("doesn't report undefined returning functions when allowed", async () => {
          await valid({
            code: dedent`
              function foo(bar: number): undefined {
                return undefined;
              }
            `,
            options: [{ allowUndefined: true }],
          });
        });

        it("doesn't report undefined returning functions with inferred return type when allowed", async () => {
          await valid({
            code: dedent`
              function foo(bar: number) {
                return undefined;
              }
            `,
            options: [{ allowUndefined: true }],
          });
        });

        it("reports undefined returning functions when disallowed", async () => {
          const invalidResult = await invalid({
            code: dedent`
              function foo(bar: number): undefined {
                return undefined;
              }
            `,
            options: [{ allowUndefined: false }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });

        it("reports undefined returning functions with inferred return type when disallowed", async () => {
          const invalidResult = await invalid({
            code: dedent`
              function foo(bar: number) {
                return undefined;
              }
            `,
            options: [{ allowUndefined: false }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });
      });

      describe("ignoreInferredTypes", () => {
        it("doesn't report inferred void return type", async () => {
          await valid({
            code: dedent`
              function foo(bar: number) {
                console.log(bar);
              }
            `,
            options: [{ ignoreInferredTypes: true }],
          });
        });

        it("doesn't report inferred null return type", async () => {
          await valid({
            code: dedent`
              function foo(bar: number) {
                return null;
              }
            `,
            options: [{ ignoreInferredTypes: true, allowNull: false }],
          });
        });

        it("doesn't report inferred undefined return type", async () => {
          await valid({
            code: dedent`
              function foo(bar: number) {
                return undefined;
              }
            `,
            options: [{ ignoreInferredTypes: true, allowUndefined: false }],
          });
        });
      });
    });
  });
});
