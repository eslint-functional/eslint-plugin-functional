import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/prefer-tacit";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it('reports functions that can "safely" be changed', async () => {
      const invalidResult1 = await invalid({
        code: dedent`
          function f(x) {}
          const foo = x => f(x);
        `,
        errors: ["generic"],
      });
      expect(invalidResult1.result).toMatchSnapshot();

      const invalidResult2 = await invalid({
        code: dedent`
          const foo = [1, 2, 3].map(x => Boolean(x));
        `,
        errors: ["generic"],
      });
      expect(invalidResult2.result).toMatchSnapshot();
    });

    it("reports functions that are just instantiations", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function f<T>(x: T): T {}
          function foo(x) { return f<number>(x); }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("doesn't report functions without type defs", async () => {
      await valid(dedent`
        function foo(x) {
          f(x);
        }
      `);

      await valid(dedent`
        const foo = function (x) {
          f(x);
        };
      `);

      await valid(dedent`
        const foo = (x) => {
          f(x);
        };
      `);
    });

    it("doesn't report functions using a different number of parameters", async () => {
      await valid(dedent`
        function f(x, y) {}
        const foo = x => f(x);
      `);

      await valid(dedent`
        const a = ['1', '2'];
        a.map((x) => Number.parseInt(x));
      `);
    });

    it("doesn't report functions using default parameters", async () => {
      await valid(dedent`
        function f(x, y = 1) {}
        const foo = x => f(x);
      `);
    });

    it("doesn't report functions with optional parameters", async () => {
      await valid(dedent`
        function f(x: number, y?: nunber) {}
        const foo = x => f(x);
      `);
    });

    it("doesn't report instantiation expressions", async () => {
      await valid(dedent`
        function f(x) {}
        const foo = f<number>;
      `);
    });

    describe("options", () => {
      describe("checkMemberExpressions", () => {
        it("doesn't report member expressions when disabled", async () => {
          await valid({
            code: dedent`
              declare const a: { b(arg: string): string; };
              function foo(x) { return a.b(x); }
            `,
            options: [{ checkMemberExpressions: false }],
          });

          await valid({
            code: dedent`
              [''].filter(str => /a/.test(str))
            `,
            options: [{ checkMemberExpressions: false }],
          });
        });

        it("report member expressions when enabled", async () => {
          const invalidResult1 = await invalid({
            code: dedent`
              declare const a: { b(arg: string): string; };
              function foo(x) { return a.b(x); }
            `,
            options: [{ checkMemberExpressions: true }],
            errors: ["generic"],
          });
          expect(invalidResult1.result).toMatchSnapshot();

          const invalidResult2 = await invalid({
            code: dedent`
              [''].filter(str => /a/.test(str))
            `,
            options: [{ checkMemberExpressions: true }],
            errors: ["generic"],
          });
          expect(invalidResult2.result).toMatchSnapshot();
        });
      });
    });
  });
});
