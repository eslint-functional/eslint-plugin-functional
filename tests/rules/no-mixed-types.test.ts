import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-mixed-types";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("doesn't report non-issues", async () => {
      await valid({
        code: dedent`
          type Foo = {
            bar: string;
            baz: number;
          };
        `,
      });

      await valid({
        code: dedent`
          interface Foo {
            bar: string;
            baz: number;
          }
        `,
      });

      await valid({
        code: dedent`
          type Foo = {
            bar: () =>string;
            baz(): number;
          };
        `,
      });

      await valid({
        code: dedent`
          interface Foo {
            bar: () => string;
            baz(): number;
          }
        `,
      });
    });

    it("reports mixed types in interfaces", async () => {
      const invalidResult = await invalid({
        code: dedent`
          interface Foo {
            bar: string;
            baz(): number;
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("reports mixed types in type literals", async () => {
      const invalidResult = await invalid({
        code: dedent`
          type Foo = {
            bar: string;
            baz(): number;
          };
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("checkTypeLiterals", () => {
        it("should report mixed types in type literals when enabled", async () => {
          const invalidResult = await invalid({
            code: dedent`
              type Foo = {
                bar: string;
                baz(): number;
              };
            `,
            options: [{ checkTypeLiterals: true }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });

        it("should not report mixed types in type literals when disabled", async () => {
          await valid({
            code: dedent`
              type Foo = {
                bar: string;
                baz(): number;
              };
            `,
            options: [{ checkTypeLiterals: false }],
          });
        });
      });

      describe("checkInterfaces", () => {
        it("should report mixed types in interfaces when enabled", async () => {
          const invalidResult = await invalid({
            code: dedent`
              interface Foo { bar: string; baz(): number; }
            `,
            options: [{ checkInterfaces: true }],
            errors: ["generic"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });

        it("should not report mixed types in interfaces when disabled", async () => {
          await valid({
            code: dedent`
              interface Foo {
                bar: string;
                baz(): number;
              }
            `,
            options: [{ checkInterfaces: false }],
          });
        });
      });
    });
  });
});
