import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { Immutability } from "is-immutable-type";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/type-declaration-immutability";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const options = [
      {
        rules: [
          {
            identifiers: ["^I?Immutable.+"],
            immutability: Immutability.Immutable,
            comparator: "AtLeast",
          },
          {
            identifiers: ["^I?ReadonlyDeep.+"],
            immutability: Immutability.ReadonlyDeep,
            comparator: "AtLeast",
          },
          {
            identifiers: ["^I?Readonly.+"],
            immutability: Immutability.ReadonlyShallow,
            comparator: "AtLeast",
          },
          {
            identifiers: ["^I?Mutable.+"],
            immutability: Immutability.Mutable,
            comparator: "AtMost",
          },
        ],
      },
    ];

    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("reports invalid shallow records", async () => {
      const invalidResult1 = await invalid({
        code: dedent`
          type ReadonlyFoo = {
            foo: number;
          };
        `,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult1.result).toMatchSnapshot();

      const invalidResult2 = await invalid({
        code: dedent`
          type ReadonlyFoo = {
            readonly foo: number;
            bar: {
              baz: string;
            };
          }
        `,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult2.result).toMatchSnapshot();
    });

    it("reports invalid immutable/deep records", async () => {
      const invalidResult1 = await invalid({
        code: dedent`
          type ReadonlyDeepFoo = {
                      readonly foo: number;
                      readonly bar: {
                        baz: string;
                      };
                    };
        `,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult1.result).toMatchSnapshot();

      const invalidResult2 = await invalid({
        code: dedent`
          type ImmutableFoo = {
                      readonly foo: number;
                      readonly bar: {
                        baz: string;
                      };
                    };
        `,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult2.result).toMatchSnapshot();
    });

    it("reports invalid shallow arrays", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyMyArray = Array<string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid deep arrays", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyDeepMyArray = ReadonlyArray<{ foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid immutable arrays", async () => {
      const invalidResult = await invalid({
        code: `type ImmutableMyArray = ReadonlyArray<{ readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid shallow sets", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyMySet = Set<string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid deep sets", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyDeepMySet = ReadonlySet<{ foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid immutable sets", async () => {
      const invalidResult = await invalid({
        code: `type ImmutableMySet = ReadonlySet<{ readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid shallow maps", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyMyMap = Map<string, string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid deep maps", async () => {
      const invalidResult = await invalid({
        code: `type ReadonlyDeepMyMap = ReadonlyMap<string, { foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports invalid immutable maps", async () => {
      const invalidResult = await invalid({
        code: `type ImmutableMyMap = ReadonlyMap<string, { readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports non-mutable primitives", async () => {
      const invalidResult = await invalid({
        code: "type MutableString = string;",
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports non-mutable records", async () => {
      const invalidResult1 = await invalid({
        code: dedent`
          type MutableFoo = {
            readonly foo: number;
          };
        `,
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult1.result).toMatchSnapshot();

      const invalidResult2 = await invalid({
        code: dedent`
          type MutableFoo = Readonly<{
            foo: number;
          }>;
        `,
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult2.result).toMatchSnapshot();
    });

    it("doesn't report mutable sets", async () => {
      await valid({
        code: `type MutableSet = Set<string>;`,
        options,
      });
    });

    it("doesn't report mutable map", async () => {
      await valid({
        code: `type MutableMap = Map<string, string>;`,
        options,
      });
    });

    it("doesn't report valid types", async () => {
      await valid({
        code: "type ReadonlyString = string;",
        options,
      });
      await valid({
        code: "type ReadonlyFoo = { readonly foo: number };",
        options,
      });
      await valid({
        code: "type ReadonlyFoo = Readonly<{ foo: number }>;",
        options,
      });
      await valid({
        code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { baz: string; }; };",
        options,
      });
      await valid({
        code: "type ReadonlySet = ReadonlySet<string>;",
        options,
      });
      await valid({
        code: "type ReadonlyMap = ReadonlyMap<string, string>;",
        options,
      });
      await valid({
        code: "type ReadonlyDeepString = string;",
        options,
      });
      await valid({
        code: "type ReadonlyDeepFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
        options,
      });
      await valid({
        code: "type ReadonlyDeepSet = ReadonlySet<string>;",
        options,
      });
      await valid({
        code: "type ReadonlyDeepMap = ReadonlyMap<string, string>;",
        options,
      });
      await valid({
        code: "type ReadonlyDeepSet = ReadonlySet<{ readonly foo: string; }>;",
        options,
      });
      await valid({
        code: "type ReadonlyDeepMap = ReadonlyMap<string, { readonly foo: string; }>;",
        options,
      });
      await valid({
        code: "type ImmutableString = string;",
        options,
      });
      await valid({
        code: "type ImmutableFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
        options,
      });
      await valid({
        code: "type ImmutableSet = Readonly<ReadonlySet<{ readonly foo: string; }>>;",
        options,
      });
      await valid({
        code: "type ImmutableMap = Readonly<ReadonlyMap<string, { readonly foo: string; }>>;",
        options,
      });
      await valid({
        code: "type MutableFoo = { foo: number };",
        options,
      });
      await valid({
        code: "type MutableFoo = { readonly foo: number; bar: { readonly baz: string; }; };",
        options,
      });
      await valid({
        code: "type MutableSet = Set<{ readonly foo: string; }>;",
        options,
      });
      await valid({
        code: "type MutableMap = Map<string, { readonly foo: string; }>;",
        options,
      });
    });

    describe("ignoreInterfaces", () => {
      it("doesn't report interfaces when enabled", async () => {
        await valid({
          code: dedent`
            interface ReadonlyFoo {
              foo: number;
            }
          `,
          options: [{ ignoreInterfaces: true }],
        });
      });
    });

    describe("ignoreIdentifierPattern", () => {
      it("doesn't report interfaces when enabled", async () => {
        await valid({
          code: dedent`
            type ReadonlyFoo = {
              foo: number;
            };
          `,
          options: [
            {
              ignoreIdentifierPattern: "Foo",
            },
          ],
        });
      });
    });

    it("respects override settings", async () => {
      await valid({
        code: dedent`
          type ReadonlyDeepFoo = ReadonlyDeep<{ foo: { bar: string; }; }>;
          type ReadonlyDeep<T> = T;
        `,
        options,
        settings: {
          immutability: {
            overrides: [
              {
                type: "ReadonlyDeep",
                to: Immutability.ReadonlyDeep,
              },
            ],
          },
        },
      });

      const invalidResult = await invalid({
        code: `type MutableSet = Set<string>;`,
        options,
        settings: {
          immutability: {
            overrides: {
              keepDefault: false,
              values: [
                {
                  type: { from: "lib", name: "Set" },
                  to: Immutability.Immutable,
                },
              ],
            },
          },
        },
        errors: ["AtMost"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });
  });
});
