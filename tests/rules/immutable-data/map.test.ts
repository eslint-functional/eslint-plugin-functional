import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/immutable-data";

import { typescriptConfig } from "../../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("report mutating map methods", () => {
      const invalidResult = invalid({
        code: dedent`
          const x = new Map([[5, 6]]);
          x.set(4, 8);
          x.delete(4);
          x.clear();
        `,
        options: [],
        errors: ["map", "map", "map"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("doesn't report non-mutating map methods", () => {
      valid(dedent`
        const x = new Map([[5, 6]]);
        x.size;
        x.has(4);
        x.values();
        x.entries();
        x.keys();
      `);
    });

    it("doesn't report mutating map methods on non-map objects", () => {
      valid(dedent`
        const z = {
          set: function () {},
          delete: function () {},
          clear: function () {},
        };

        z.set();
        z.delete();
        z.clear();
      `);
    });

    describe("options", () => {
      describe("ignoreNonConstDeclarations", () => {
        it("reports variables declared as const", () => {
          const invalidResult = invalid({
            code: dedent`
              const x = new Map([[5, 6]]);
              x.set(4, 8);
              x.delete(4);
              x.clear();
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
            errors: ["map", "map", "map"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("doesn't report variables not declared as const", () => {
          valid({
            code: dedent`
              let x = new Map([[5, 6]]);
              x.set(4, 8);
              x.delete(4);
              x.clear();
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
          });
        });
      });

      describe("ignoreImmediateMutation", () => {
        it("doesn't report immediately mutation when enabled", () => {
          valid({
            code: dedent`
              new Map([[5, 6]]).set(4, 8);
              new Map([[5, 6]]).delete(4);
              new Map([[5, 6]]).clear();
            `,
            options: [
              {
                ignoreImmediateMutation: true,
              },
            ],
          });
        });

        it("reports immediately mutation when disabled", () => {
          const invalidResult = invalid({
            code: dedent`
              new Map([[5, 6]]).set(4, 8);
              new Map([[5, 6]]).delete(4);
              new Map([[5, 6]]).clear();
            `,
            options: [
              {
                ignoreImmediateMutation: false,
              },
            ],
            errors: ["map", "map", "map"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });
    });
  });
});
