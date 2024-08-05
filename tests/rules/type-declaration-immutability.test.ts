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

    it("reports invalid shallow records", () => {
      const invalidResult1 = invalid({
        code: dedent`
          type ReadonlyFoo = {
            foo: number;
          };
        `,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult1.messages).toMatchSnapshot();

      const invalidResult2 = invalid({
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
      expect(invalidResult2.messages).toMatchSnapshot();
    });

    it("reports invalid immutable/deep records", () => {
      const invalidResult1 = invalid({
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
      expect(invalidResult1.messages).toMatchSnapshot();

      const invalidResult2 = invalid({
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
      expect(invalidResult2.messages).toMatchSnapshot();
    });

    it("reports invalid shallow arrays", () => {
      const invalidResult = invalid({
        code: `type ReadonlyMyArray = Array<string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid deep arrays", () => {
      const invalidResult = invalid({
        code: `type ReadonlyDeepMyArray = ReadonlyArray<{ foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid immutable arrays", () => {
      const invalidResult = invalid({
        code: `type ImmutableMyArray = ReadonlyArray<{ readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid shallow sets", () => {
      const invalidResult = invalid({
        code: `type ReadonlyMySet = Set<string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid deep sets", () => {
      const invalidResult = invalid({
        code: `type ReadonlyDeepMySet = ReadonlySet<{ foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid immutable sets", () => {
      const invalidResult = invalid({
        code: `type ImmutableMySet = ReadonlySet<{ readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid shallow maps", () => {
      const invalidResult = invalid({
        code: `type ReadonlyMyMap = Map<string, string>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid deep maps", () => {
      const invalidResult = invalid({
        code: `type ReadonlyDeepMyMap = ReadonlyMap<string, { foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports invalid immutable maps", () => {
      const invalidResult = invalid({
        code: `type ImmutableMyMap = ReadonlyMap<string, { readonly foo: string; }>;`,
        options,
        errors: ["AtLeast"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports non-mutable primitives", () => {
      const invalidResult = invalid({
        code: "type MutableString = string;",
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports non-mutable records", () => {
      const invalidResult1 = invalid({
        code: dedent`
          type MutableFoo = {
            readonly foo: number;
          };
        `,
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult1.messages).toMatchSnapshot();

      const invalidResult2 = invalid({
        code: dedent`
          type MutableFoo = Readonly<{
            foo: number;
          }>;
        `,
        options,
        errors: ["AtMost"],
      });
      expect(invalidResult2.messages).toMatchSnapshot();
    });

    it("doesn't report mutable sets", () => {
      valid({
        code: `type MutableSet = Set<string>;`,
        options,
      });
    });

    it("doesn't report mutable map", () => {
      valid({
        code: `type MutableMap = Map<string, string>;`,
        options,
      });
    });

    it("doesn't report valid types", () => {
      valid({
        code: "type ReadonlyString = string;",
        options,
      });
      valid({
        code: "type ReadonlyFoo = { readonly foo: number };",
        options,
      });
      valid({
        code: "type ReadonlyFoo = Readonly<{ foo: number }>;",
        options,
      });
      valid({
        code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { baz: string; }; };",
        options,
      });
      valid({
        code: "type ReadonlySet = ReadonlySet<string>;",
        options,
      });
      valid({
        code: "type ReadonlyMap = ReadonlyMap<string, string>;",
        options,
      });
      valid({
        code: "type ReadonlyDeepString = string;",
        options,
      });
      valid({
        code: "type ReadonlyDeepFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
        options,
      });
      valid({
        code: "type ReadonlyDeepSet = ReadonlySet<string>;",
        options,
      });
      valid({
        code: "type ReadonlyDeepMap = ReadonlyMap<string, string>;",
        options,
      });
      valid({
        code: "type ReadonlyDeepSet = ReadonlySet<{ readonly foo: string; }>;",
        options,
      });
      valid({
        code: "type ReadonlyDeepMap = ReadonlyMap<string, { readonly foo: string; }>;",
        options,
      });
      valid({
        code: "type ImmutableString = string;",
        options,
      });
      valid({
        code: "type ImmutableFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
        options,
      });
      valid({
        code: "type ImmutableSet = Readonly<ReadonlySet<{ readonly foo: string; }>>;",
        options,
      });
      valid({
        code: "type ImmutableMap = Readonly<ReadonlyMap<string, { readonly foo: string; }>>;",
        options,
      });
      valid({
        code: "type MutableFoo = { foo: number };",
        options,
      });
      valid({
        code: "type MutableFoo = { readonly foo: number; bar: { readonly baz: string; }; };",
        options,
      });
      valid({
        code: "type MutableSet = Set<{ readonly foo: string; }>;",
        options,
      });
      valid({
        code: "type MutableMap = Map<string, { readonly foo: string; }>;",
        options,
      });
    });

    describe("ignoreInterfaces", () => {
      it("doesn't report interfaces when enabled", () => {
        valid({
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
      it("doesn't report interfaces when enabled", () => {
        valid({
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

    it("respects override settings", () => {
      valid({
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

      const invalidResult = invalid({
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
      expect(invalidResult.messages).toMatchSnapshot();
    });
  });
});
