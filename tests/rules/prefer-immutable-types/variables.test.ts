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

    it("reports non-immutable set variables", () => {
      const invalidResult = invalid({
        code: "const foo: ReadonlySet<string> = {} as any;",
        errors: ["variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports non-immutable map variables", () => {
      const invalidResult = invalid({
        code: "const foo: ReadonlyMap<string, string> = {} as any;",
        errors: ["variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports mutable records variables", () => {
      const invalidResult = invalid({
        code: "const foo: { foo: string } = {} as any;",
        errors: ["variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports mutable records variables and suggests a fix for ReadonlyShallow", () => {
      const invalidResult = invalid({
        code: "const foo: { foo: string } = {} as any;",
        options: [{ variables: "ReadonlyShallow" }],
        errors: ["variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("doesn't report type assertion variables", () => {
      valid({
        code: "function foo(arg0: { foo: string | number }, arg1: { foo: string | number }): arg0 is { foo: number } {}",
        options: [
          {
            parameters: false,
            variables: "ReadonlyShallow",
          },
        ],
      });
    });

    it("suggest multiple fixes for collections for ReadonlyShallow", () => {
      const invalidResult = invalid({
        code: dedent`
          const foo: Array<string> = {} as any;
          const foo: string[] = {} as any;
          const foo: Set<string> = {} as any;
          const foo: Map<string, string> = {} as any;
          const foo: ReadonlyArray<string> = {} as any;
          const foo: readonly string[] = {} as any;
          const foo: ReadonlySet<string> = {} as any;
          const foo: ReadonlyMap<string, string> = {} as any;
        `,
        options: [{ variables: "ReadonlyShallow" }],
        errors: ["variable", "variable", "variable", "variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(2);
      }
    });

    it("reports mutable class parameter properties", () => {
      const invalidResult = invalid({
        code: dedent`
          class Klass {
            readonly foo: { foo: number };
            private readonly bar: { foo: number };
            static readonly baz: { foo: number };
            private static readonly qux: { foo: number };
          }
        `,
        errors: ["propertyImmutability", "propertyImmutability", "propertyImmutability", "propertyImmutability"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("allows for user suggestions", () => {
      const invalidResult = invalid({
        code: "const foo: { foo: string } = {} as any;",
        options: [
          {
            variables: "ReadonlyDeep",
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
        errors: ["variable"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("allows for user fixes", () => {
      const invalidResult = invalid({
        code: dedent`
          const foo: Array<string> = {} as any;
          const foo: string[] = {} as any;
          const foo: Set<string> = {} as any;
          const foo: Map<string, string> = {} as any;
          const foo: ReadonlyArray<string> = {} as any;
          const foo: readonly string[] = {} as any;
          const foo: ReadonlySet<string> = {} as any;
          const foo: ReadonlyMap<string, string> = {} as any;
        `,
        options: [
          {
            variables: "Immutable",
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
        errors: ["variable", "variable", "variable", "variable", "variable", "variable", "variable", "variable"],
        verifyAfterFix: false, // "fix" doesn't fix arrays so they will still report.
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it.each([[[{ variables: "ReadonlyShallow" }]], [[{ variables: "ReadonlyDeep" }]], [[{ variables: "Immutable" }]]])(
      "doesn't reports valid variables",
      (options) => {
        valid({
          code: "const foo: boolean = {} as any;",
          options,
        });
        valid({
          code: "const foo: true = {} as any;",
          options,
        });
        valid({
          code: "const foo: string = {} as any;",
          options,
        });
        valid({
          code: "const foo: 'bar' = {} as any;",
          options,
        });
        valid({
          code: "const foo: undefined = {} as any;",
          options,
        });
        valid({
          code: "const foo: readonly string[] = {} as any;",
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
        valid({
          code: "const foo: { readonly foo: string } = {} as any;",
          options,
        });
        valid({
          code: "const foo: { readonly foo: { readonly bar: number } } = {} as any;",
          options,
        });
        valid({
          code: "const foo: Readonly<ReadonlySet<string>> = {} as any;",
          options,
        });
        valid({
          code: "const foo: Readonly<ReadonlyMap<string, string>> = {} as any;",
          options,
        });
        valid({
          code: "function foo(arg: { foo: string | number }): arg is { foo: number } {}",
          options,
        });
        valid({
          code: "const [a, b] = [1, 2];",
          options,
        });
        valid({
          code: "const { a, b } = { a: 1, b: 2 };",
          options,
        });

        if (options[0]!.variables !== "Immutable") {
          valid({
            code: "const foo: { foo(): void } = {} as any;",
            options,
          });
          valid({
            code: "const foo: ReadonlyArray<string> = {} as any;",
            options,
          });
          valid({
            code: "const foo: readonly [string, number] = {} as any;",
            options,
          });
          valid({
            code: "const foo: Readonly<[string, number]> = {} as any;",
            options,
          });
          valid({
            code: "const foo: { foo: () => void } = {} as any;",
            options,
          });
          valid({
            code: "const foo: ReadonlySet<string> = {} as any;",
            options,
          });
          valid({
            code: "const foo: ReadonlyMap<string, string> = {} as any;",
            options,
          });
        }
      },
    );

    describe("options", () => {
      describe("ignoreClasses", () => {
        it("doesn't report class fields", () => {
          valid({
            code: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static baz: number;
                private static qux: number;
              }
            `,
            options: [{ ignoreClasses: true }],
          });
        });
      });

      describe("ignoreInFunctions", () => {
        it("doesn't report variables in functions", () => {
          valid({
            code: dedent`
              function foo() {
                let foo: {
                  a: { foo: number },
                  b: string[],
                  c: { [key: string]: string[] },
                  [key: string]: any,
                }
              };
            `,
            options: [{ variables: { ignoreInFunctions: true } }],
          });
        });
      });

      describe("ignoreNamePattern", () => {
        it("doesn't report ignored names", () => {
          valid({
            code: "let mutableFoo: string[] = [];",
            options: [{ ignoreNamePattern: "^mutable" }],
          });
        });
      });

      describe("ignoreTypePattern", () => {
        it("doesn't report ignored types", () => {
          valid({
            code: dedent`
              let fooMutable: Readonly<
                string[]
              > = [];
            `,
            options: [{ ignoreTypePattern: "^Readonly<.+>$" }],
          });
        });
      });
    });
  });
});
