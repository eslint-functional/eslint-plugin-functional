import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/prefer-immutable-types";

import { typescriptConfig } from "../../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("reports non-immutable set parameters", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg: ReadonlySet<string>) {}",
        errors: ["parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports non-immutable map parameters", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg: ReadonlyMap<string, string>) {}",
        errors: ["parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable records parameters", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg1: { foo: string }, arg2: { foo: number }) {}",
        errors: ["parameter", "parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable records parameters and suggests a fix for ReadonlyShallow", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg1: { foo: string }, arg2: { foo: number }) {}",
        options: [{ parameters: "ReadonlyShallow" }],
        errors: ["parameter", "parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
      for (const message of invalidResult.result.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("reports mutable class parameter properties", async () => {
      const invalidResult = await invalid({
        code: dedent`
          class Klass {
            constructor (
              public publicProp: string,
              protected protectedProp: string,
              private privateProp: string,
          ) { }
          }
        `,
        errors: ["propertyModifier", "propertyModifier", "propertyModifier"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable class parameter properties and suggests a fix for ReadonlyShallow", async () => {
      const invalidResult = await invalid({
        code: dedent`
          class Klass {
            constructor (
              public publicProp: string,
              protected protectedProp: string,
              private privateProp: string,
          ) { }
          }
        `,
        options: [{ parameters: "ReadonlyShallow" }],
        errors: ["propertyModifier", "propertyModifier", "propertyModifier"],
      });
      expect(invalidResult.result).toMatchSnapshot();
      for (const message of invalidResult.result.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("doesn't report type assertion parameters", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg0: { foo: string | number }, arg1: { foo: string | number }): arg0 is { foo: number } {}",
        options: [{ parameters: "ReadonlyShallow" }],
        errors: ["parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
      for (const message of invalidResult.result.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("suggest multiple fixes for collections for ReadonlyShallow", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(arg: Array<string>) {}
          function foo(arg: string[]) {}
          function foo(arg: Set<string>) {}
          function foo(arg: Map<string, string>) {}
          function foo(arg: ReadonlyArray<string>) {}
          function foo(arg: readonly string[]) {}
          function foo(arg: ReadonlySet<string>) {}
          function foo(arg: ReadonlyMap<string, string>) {}
        `,
        options: [{ parameters: "ReadonlyShallow" }],
        errors: ["parameter", "parameter", "parameter", "parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
      for (const message of invalidResult.result.messages) {
        expect(message.suggestions).toHaveLength(2);
      }
    });

    it("allows for user suggestions", async () => {
      const invalidResult = await invalid({
        code: "function foo(arg1: { foo: string }) {}",
        options: [
          {
            parameters: "ReadonlyDeep",
            suggestions: {
              ReadonlyDeep: [
                [
                  {
                    pattern: "^(?!ReadonlyDeep)(?:Readonly<(.+)>|(.+))$",
                    replace: "ReadonlyDeep<$1$2>",
                  },
                ],
              ],
            },
          },
        ],
        errors: ["parameter"],
      });
      expect(invalidResult.result).toMatchSnapshot();
      for (const message of invalidResult.result.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("allows for user fixes", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(arg: Array<string>) {}
          function foo(arg: string[]) {}
          function foo(arg: Set<string>) {}
          function foo(arg: Map<string, string>) {}
          function foo(arg: ReadonlyArray<string>) {}
          function foo(arg: readonly string[]) {}
          function foo(arg: ReadonlySet<string>) {}
          function foo(arg: ReadonlyMap<string, string>) {}
        `,
        options: [
          {
            parameters: "Immutable",
            fixer: {
              Immutable: [
                {
                  pattern: "^(?:Readonly)?(Set|Map)<(.+)>$",
                  replace: "Readonly<Readonly$1<$2>>",
                },
              ],
            },
          },
        ],
        errors: [
          "parameter",
          "parameter",
          "parameter",
          "parameter",
          "parameter",
          "parameter",
          "parameter",
          "parameter",
        ],
        verifyAfterFix: false, // "fix" doesn't fix arrays so they will still report.
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it.each([
      [[{ parameters: "ReadonlyShallow" }]],
      [[{ parameters: "ReadonlyDeep" }]],
      [[{ parameters: "Immutable" }]],
    ])("doesn't reports valid parameters", async (options) => {
      await valid({
        code: "function foo(arg: boolean) {}",
        options,
      });
      await valid({
        code: "function foo(arg: true) {}",
        options,
      });
      await valid({
        code: "function foo(arg: string) {}",
        options,
      });
      await valid({
        code: "function foo(arg: 'bar') {}",
        options,
      });
      await valid({
        code: "function foo(arg: undefined) {}",
        options,
      });
      await valid({
        code: "function foo(arg: readonly string[]) {}",
        options,
        settings: {
          immutability: {
            overrides: [
              {
                type: { from: "lib", name: "ReadonlyArray" },
                to: "Immutable",
              },
            ],
          },
        },
      });
      await valid({
        code: "function foo(arg: { readonly foo: string }) {}",
        options,
      });
      await valid({
        code: "function foo(arg: { readonly foo: { readonly bar: number } }) {}",
        options,
      });
      await valid({
        code: "function foo(arg: Readonly<ReadonlySet<string>>) {}",
        options,
      });
      await valid({
        code: "function foo(arg: Readonly<ReadonlyMap<string, string>>) {}",
        options,
      });
      await valid({
        code: "function foo(arg: { foo: string | number }): arg is { foo: number } {}",
        options,
      });

      if (options[0]!.parameters !== "Immutable") {
        await valid({
          code: "function foo(arg: { foo(): void }) {}",
          options,
        });
        await valid({
          code: "function foo(arg: ReadonlyArray<string>) {}",
          options,
        });
        await valid({
          code: "function foo(arg: readonly [string, number]) {}",
          options,
        });
        await valid({
          code: "function foo(arg: Readonly<[string, number]>) {}",
          options,
        });
        await valid({
          code: "function foo(arg: { foo: () => void }) {}",
          options,
        });
        await valid({
          code: "function foo(arg: ReadonlySet<string>) {}",
          options,
        });
        await valid({
          code: "function foo(arg: ReadonlyMap<string, string>) {}",
          options,
        });
        await valid({
          code: dedent`
            class Foo {
              constructor(
                private readonly arg1: readonly string[],
                public readonly arg2: readonly string[],
                protected readonly arg3: readonly string[],
                readonly arg4: readonly string[],
              ) {}
            }
          `,
          options,
        });
        await valid({
          code: dedent`
            interface Foo {
              (arg: readonly string[]): void;
            }
          `,
          options,
        });
        await valid({
          code: dedent`
            interface Foo {
              new (arg: readonly string[]): void;
            }
          `,
          options,
        });
      }
    });
  });
});
