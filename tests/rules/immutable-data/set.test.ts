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

    it("report mutating set methods", async () => {
      const invalidResult = await invalid({
        code: dedent`
          const x = new Set([5, 6]);
          x.add(4);
          x.delete(4);
          x.clear();
        `,
        options: [],
        errors: ["set", "set", "set"],
      });
      expect(invalidResult.result.messages).toMatchSnapshot();
    });

    it("doesn't report mutating set methods when ignoring maps and sets", async () => {
      await valid({
        code: dedent`
          const x = new Set([5, 6]);
          x.add(4);
          x.delete(4);
          x.clear();
        `,
        options: [
          {
            ignoreMapsAndSets: true,
          },
        ],
      });
    });

    it("doesn't report non-mutating set methods", async () => {
      await valid(dedent`
        const x = new Set([5, 6]);
        x.size;
        x.has(4);
        x.values();
        x.entries();
        x.keys();
        x.difference(new Set([1, 2, 3]));
        x.intersection(new Set([1, 2, 3]));
        x.symmetricDifference(new Set([1, 2, 3]));
        x.union(new Set([1, 2, 3]));
      `);
    });

    it("allows mutating set methods to be chained to new set methods", async () => {
      await valid(dedent`
        const x = new Set([5, 6]);

        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);
        x.difference(new Set([1, 2, 3])).add(4);

        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);
        x.intersection(new Set([1, 2, 3])).add(4);

        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);
        x.symmetricDifference(new Set([1, 2, 3])).add(4);

        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
        x.union(new Set([1, 2, 3])).add(4);
      `);
    });

    it("doesn't report mutating set methods on non-set objects", async () => {
      await valid(dedent`
        const z = {
          add: function () {},
          delete: function () {},
          clear: function () {},
        };

        z.add();
        z.delete();
        z.clear();
      `);
    });

    describe("options", () => {
      describe("ignoreNonConstDeclarations", () => {
        it("reports variables declared as const", async () => {
          const invalidResult = await invalid({
            code: dedent`
              const x = new Set([5, 6]);
              x.add(4);
              x.delete(4);
              x.clear();
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
            errors: ["set", "set", "set"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });

        it("doesn't report variables not declared as const", async () => {
          await valid({
            code: dedent`
              let x = new Set([5, 6]);
              x.add(4);
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
        it("doesn't report immediately mutation when enabled", async () => {
          await valid({
            code: dedent`
              new Set([5, 6]).add(4);
              new Set([5, 6]).delete(4);
              new Set([5, 6]).clear();
            `,
            options: [
              {
                ignoreImmediateMutation: true,
              },
            ],
          });
        });

        it("reports immediately mutation when disabled", async () => {
          const invalidResult = await invalid({
            code: dedent`
              new Set([5, 6]).add(4);
              new Set([5, 6]).delete(4);
              new Set([5, 6]).clear();
            `,
            options: [
              {
                ignoreImmediateMutation: false,
              },
            ],
            errors: ["set", "set", "set"],
          });
          expect(invalidResult.result.messages).toMatchSnapshot();
        });
      });
    });
  });
});
