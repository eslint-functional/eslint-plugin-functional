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

    it("reports non-immutable set return types", () => {
      const invalidResult = invalid({
        code: "function foo(): ReadonlySet<string> {}",
        errors: ["returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports non-immutable map return types", () => {
      const invalidResult = invalid({
        code: "function foo(): ReadonlyMap<string, string> {}",
        errors: ["returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports mutable records return types", () => {
      const invalidResult = invalid({
        code: "function foo(): { foo: string } {}",
        errors: ["returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports mutable records return types and suggests a fix for ReadonlyShallow", () => {
      const invalidResult = invalid({
        code: "function foo(): { foo: string } {}",
        options: [{ returnTypes: "ReadonlyShallow" }],
        errors: ["returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("doesn't report type assertion return types", () => {
      valid({
        code: "function foo(arg0: { foo: string | number }, arg1: { foo: string | number }): arg0 is { foo: number } {}",
        options: [
          {
            parameters: false,
            returnTypes: "ReadonlyShallow",
          },
        ],
      });
    });

    it("suggest multiple fixes for collections for ReadonlyShallow", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo(): Array<string> {}
          function foo(): string[] {}
          function foo(): Set<string> {}
          function foo(): Map<string, string> {}
          function foo(): ReadonlyArray<string> {}
          function foo(): readonly string[] {}
          function foo(): ReadonlySet<string> {}
          function foo(): ReadonlyMap<string, string> {}
        `,
        options: [{ returnTypes: "ReadonlyShallow" }],
        errors: ["returnType", "returnType", "returnType", "returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(2);
      }
    });

    it("allows for user suggestions", () => {
      const invalidResult = invalid({
        code: "function foo(): { foo: string } {}",
        options: [
          {
            returnTypes: "ReadonlyDeep",
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
        errors: ["returnType"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
      for (const message of invalidResult.messages) {
        expect(message.suggestions).toHaveLength(1);
      }
    });

    it("allows for user fixes", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo(): Array<string> {}
          function foo(): string[] {}
          function foo(): Set<string> {}
          function foo(): Map<string, string> {}
          function foo(): ReadonlyArray<string> {}
          function foo(): readonly string[] {}
          function foo(): ReadonlySet<string> {}
          function foo(): ReadonlyMap<string, string> {}
        `,
        options: [
          {
            returnTypes: "Immutable",
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
          "returnType",
          "returnType",
          "returnType",
          "returnType",
          "returnType",
          "returnType",
          "returnType",
          "returnType",
        ],
        verifyAfterFix: false, // "fix" doesn't fix arrays so they will still report.
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it.each([
      [[{ returnTypes: "ReadonlyShallow" }]],
      [[{ returnTypes: "ReadonlyDeep" }]],
      [[{ returnTypes: "Immutable" }]],
    ])("doesn't reports valid return types", (options) => {
      valid({
        code: "function foo(): boolean {}",
        options,
      });
      valid({
        code: "function foo(): true {}",
        options,
      });
      valid({
        code: "function foo(): string {}",
        options,
      });
      valid({
        code: "function foo(): 'bar' {}",
        options,
      });
      valid({
        code: "function foo(): undefined {}",
        options,
      });
      valid({
        code: "function foo(): readonly string[] {}",
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
        code: "function foo(): { readonly foo: string } {}",
        options,
      });
      valid({
        code: "function foo(): { readonly foo: { readonly bar: number } } {}",
        options,
      });
      valid({
        code: "function foo(): Readonly<ReadonlySet<string>> {}",
        options,
      });
      valid({
        code: "function foo(): Readonly<ReadonlyMap<string, string>> {}",
        options,
      });
      valid({
        code: "function foo(arg: { foo: string | number }): arg is { foo: number } {}",
        options,
      });

      if (options[0]!.returnTypes !== "Immutable") {
        valid({
          code: "function foo(): { foo(): void } {}",
          options,
        });
        valid({
          code: "function foo(): ReadonlyArray<string> {}",
          options,
        });
        valid({
          code: "function foo(): readonly [string, number] {}",
          options,
        });
        valid({
          code: "function foo(): Readonly<[string, number]> {}",
          options,
        });
        valid({
          code: "function foo(): { foo: () => void } {}",
          options,
        });
        valid({
          code: "function foo(): ReadonlySet<string> {}",
          options,
        });
        valid({
          code: "function foo(): ReadonlyMap<string, string> {}",
          options,
        });
        valid({
          code: dedent`
            interface Foo {
              (): readonly string[];
            }
          `,
          options,
        });
        valid({
          code: dedent`
            interface Foo {
              new (): readonly string[];
            }
          `,
          options,
        });
      }
    });
  });
});
