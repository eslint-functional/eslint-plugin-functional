import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/prefer-readonly-type";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("reports mutable array (non-generic)", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(a: number[], b: Promise<number[]>) {
            console.log(a, b);
          }
        `,
        errors: ["array", "array"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable arrays (generic)", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(a: Array<number>, b: Promise<Array<number>>) {
            console.log(a, b);
          }
        `,
        errors: ["type", "type"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable sets", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(a: Set<number>, b: Promise<Set<number>>) {
            console.log(a, b);
          }
        `,
        errors: ["type", "type"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports mutable maps", async () => {
      const invalidResult = await invalid({
        code: dedent`
          function foo(a: Map<number>, b: Promise<Map<number>>) {
            console.log(a, b);
          }
        `,
        errors: ["type", "type"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports issue inside interfaces", async () => {
      const invalidResult = await invalid({
        code: dedent`
          interface Foo {
            readonly bar: Array<string>;
            readonly baz: Promise<Array<string>>;
          }
        `,
        errors: ["type", "type"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports issues with index signatures", async () => {
      const invalidResult = await invalid({
        code: dedent`
          interface Foo {
            readonly [key: string]: {
              readonly a: Array<string>;
              readonly b: Promise<Array<string>>;
            };
          }
          interface Bar {
            [key: string]: string
          }
          interface Baz {
            [key: string]: { prop: string }
          }
        `,
        errors: ["type", "type", "property", "property", "property"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports non-readonly class properties", async () => {
      const invalidResult = await invalid({
        code: dedent`
          class Klass {
            foo: number;
            private bar: number;
            static baz: number;
            private static qux: number;
          }
        `,
        errors: ["property", "property", "property", "property"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports non-readonly class parameter properties", async () => {
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
        errors: ["property", "property", "property"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports literals without readonly modifiers", async () => {
      const invalidResult = await invalid({
        code: dedent`
          let foo: {
            a: number,
            b: ReadonlyArray<string>,
            c: () => string,
            d: { readonly [key: string]: string },
            [key: string]: string,
            readonly e: {
              a: number,
              b: ReadonlyArray<string>,
              c: () => string,
              d: { readonly [key: string]: string },
              [key: string]: string,
            }
          };
        `,
        errors: [
          "property",
          "property",
          "property",
          "property",
          "property",
          "property",
          "property",
          "property",
          "property",
          "property",
        ],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports issues with mapped types", async () => {
      const invalidResult = await invalid({
        code: dedent`
          const func = (x: { [key in string]: number }) => {}
        `,
        errors: ["property"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("doesn't report explicit readonly parameter types", async () => {
      await valid(dedent`
        function foo(...a: ReadonlyArray<number>) {
          console.log(a);
        }
      `);

      await valid(dedent`
        const foo = (...a: readonly number[]) => {
          console.log(a);
        }
      `);

      await valid(dedent`
        const foo = (tuple: readonly [number, string, readonly [number, string]]) => {
          console.log(a);
        }
      `);
    });

    it("doesn't report explicit readonly return types", async () => {
      await valid(dedent`
        function foo(): ReadonlyArray<number> {
          return [1, 2, 3];
        }
      `);

      await valid(dedent`
        const foo = (): readonly number[] => {
          return [1, 2, 3];
        }
      `);
    });

    it("doesn't report implicit readonly arrays", async () => {
      await valid({
        code: dedent`
          const foo = [1, 2, 3];
          function bar(param = [1, 2, 3]) {}
        `,
      });
    });

    it("doesn't report readonly local types", async () => {
      await valid(dedent`
        function foo() {
          type Foo = ReadonlyArray<string>;
        }
      `);
    });

    it("doesn't report readonly variable declarations", async () => {
      await valid(dedent`
        const foo: ReadonlyArray<string> = [];
      `);
    });

    it("doesn't report interfaces with readonly modifiers", async () => {
      await valid(dedent`
        interface Foo {
          readonly a: number,
          readonly b: ReadonlyArray<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string },
          readonly [key: string]: string,
        }
      `);

      await valid(dedent`
        interface Foo {
          readonly a: number,
          readonly b: ReadonlyArray<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string },
          readonly [key: string]: string,
          readonly e: {
            readonly a: number,
            readonly b: ReadonlyArray<string>,
            readonly c: () => string,
            readonly d: { readonly [key: string]: string },
            readonly [key: string]: string,
          }
        }
      `);
    });

    it("doesn't report call signatures and method signatures", async () => {
      await valid(dedent`
        interface Foo {
          (): void
          foo(): void
        }
      `);
    });

    it("doesn't report literal with readonly index signature", async () => {
      await valid(dedent`
        let foo: { readonly [key: string]: number };
      `);
    });

    it("doesn't report type literals elements with a readonly modifer in an array", async () => {
      await valid(dedent`
        type foo = ReadonlyArray<{ readonly type: string, readonly code: string }>;
      `);
    });

    it("doesn't report type literals with readonly on members", async () => {
      await valid(dedent`
        let foo: {
          readonly a: number,
          readonly b: ReadonlyArray<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string }
          readonly [key: string]: string
        };
      `);
    });

    it("doesn't report class parameter properties", async () => {
      await valid(dedent`
        class Klass {
          constructor (
            nonParameterProp: string,
            readonly readonlyProp: string,
            public readonly publicReadonlyProp: string,
            protected readonly protectedReadonlyProp: string,
            private readonly privateReadonlyProp: string,
          ) { }
        }
      `);
    });

    it("doesn't report mapped types with readonly on members", async () => {
      await valid(dedent`
        const func = (x: { readonly [key in string]: number }) => {}
      `);
    });

    describe("options", () => {
      describe("allowMutableReturnType", () => {
        it("doesn't report mutable return types", async () => {
          await valid({
            code: dedent`
              function foo(...numbers: ReadonlyArray<number>): Array<number> {}
              function bar(...numbers: readonly number[]): number[] {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              const foo = (...numbers: ReadonlyArray<number>): Array<number> =>  {}
              const bar = (...numbers: readonly number[]): number[] =>  {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              class Foo {
                foo(...numbers: ReadonlyArray<number>): Array<number> {
                }
              }
              class Bar {
                foo(...numbers: readonly number[]): number[] {
                }
              }
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo(...numbers: ReadonlyArray<number>): Promise<Array<number>> {}
              function foo(...numbers: ReadonlyArray<number>): Promise<number[]> {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo(...numbers: ReadonlyArray<number>): Promise<Foo<Array<number>>> {}
              function foo(...numbers: ReadonlyArray<number>): Promise<Foo<number[]>> {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } | { readonly b: string[] } {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              type Foo<T> = { readonly x: T; };
              function foo(...numbers: ReadonlyArray<number>): Promise<Foo<Array<number>>> {}
              function foo(...numbers: ReadonlyArray<number>): Promise<Foo<number[]>> {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } & { readonly b: string[] } {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo<T>(x: T): T extends Array<number> ? string : number[] {}
            `,
            options: [{ allowMutableReturnType: true }],
          });

          await valid({
            code: dedent`
              function foo(bar: string): { baz: number } {
                return 1 as any;
              }
            `,
            options: [{ allowMutableReturnType: true }],
          });
        });
      });

      describe("checkImplicit", () => {
        it("doesn't report implicit readonly array variables", async () => {
          await valid({
            code: dedent`
              const numbers = [1, 2, 3] as const;
            `,
            options: [{ checkImplicit: true }],
          });
        });

        it("doesn't report implicit readonly return types", async () => {
          await valid({
            code: dedent`
              function foo() {
                return [1, 2, 3] as const;
              }
            `,
            options: [{ checkImplicit: true }],
          });

          await valid({
            code: dedent`
              const foo = async () => {
                return [1, 2, 3] as const;
              };
            `,
            options: [{ checkImplicit: true }],
          });
        });
      });

      describe("ignoreClass", () => {
        it("doesn't report classes", async () => {
          await valid({
            code: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static baz: number;
                private static qux: number;
              }
            `,
            options: [{ ignoreClass: true }],
          });
        });

        it("doesn't report classes - fieldsOnly", async () => {
          await valid({
            code: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static baz: number;
                private static qux: number;
              }
            `,
            options: [{ ignoreClass: "fieldsOnly" }],
          });
        });

        it("reports non-field issues in classes - fieldsOnly", async () => {
          const invalidResult = await invalid({
            code: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static baz: number;
                private static qux: number;

                foo() {
                  let bar: {
                    foo: number;
                  };
                }
              }
            `,
            options: [{ ignoreClass: "fieldsOnly" }],
            errors: ["property"],
          });
          expect(invalidResult.result).toMatchSnapshot();
        });
      });

      describe("ignoreInterface", () => {
        it("doesn't report interfaces", async () => {
          await valid({
            code: dedent`
              interface Foo {
                foo: number,
                bar: ReadonlyArray<string>,
                baz: () => string,
                qux: { [key: string]: string }
              }
            `,
            options: [{ ignoreInterface: true }],
          });
        });
      });

      describe("ignorePattern", () => {
        it("doesn't report matching identifiers", async () => {
          await valid({
            code: dedent`
              let mutableFoo: string[] = [];
            `,
            options: [{ ignorePattern: "^mutable" }],
          });
        });
      });

      describe("allowLocalMutation", () => {
        it("doesn't report mutable local variables", async () => {
          await valid({
            code: dedent`
              function foo() {
                let foo: {
                  a: number,
                  b: ReadonlyArray<string>,
                  c: () => string,
                  d: { [key: string]: string },
                  [key: string]: string,
                  readonly d: {
                    a: number,
                    b: ReadonlyArray<string>,
                    c: () => string,
                    d: { [key: string]: string },
                    [key: string]: string,
                  }
                }
              };
            `,
            options: [{ allowLocalMutation: true }],
          });
        });
      });

      describe("ignoreCollections", () => {
        it("doesn't report mutable arrays", async () => {
          await valid({
            code: dedent`
              type Foo = Array<string>;
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo: number[] = [];
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo = [];
            `,
            options: [{ ignoreCollections: true, checkImplicit: true }],
          });
        });

        it("doesn't report mutable tuples", async () => {
          await valid({
            code: dedent`
              type Foo = [string, string];
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo: [string, string] = ['foo', 'bar'];
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo = ['foo', 'bar'];
            `,
            options: [{ ignoreCollections: true, checkImplicit: true }],
          });
        });

        it("doesn't report mutable sets", async () => {
          await valid({
            code: dedent`
              type Foo = Set<string, string>;
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo: Set<string, string> = new Set();
            `,
            options: [{ ignoreCollections: true }],
          });
        });

        it("doesn't report mutable maps", async () => {
          await valid({
            code: dedent`
              type Foo = Map<string, string>;
            `,
            options: [{ ignoreCollections: true }],
          });

          await valid({
            code: dedent`
              const foo: Map<string, string> = new Map();
            `,
            options: [{ ignoreCollections: true }],
          });
        });
      });
    });
  });
});
