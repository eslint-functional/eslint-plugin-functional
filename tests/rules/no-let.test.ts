import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-let";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("should report let declarations", () => {
      const invalidResult = invalid({
        code: dedent`
          let x;

          function foo() {
            let y;
            let z = 0;
          }
        `,
        errors: ["generic", "generic", "generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowInFunctions", () => {
        it("should not report let declarations in function declarations", () => {
          valid({
            code: dedent`
              function foo() {
                let x;
                let y = 0;
              }
            `,
            options: [{ allowInFunctions: true }],
          });

          const invalidResult = invalid({
            code: dedent`
              let x;
              let y = 0;
            `,
            options: [{ allowInFunctions: true }],
            errors: ["generic", "generic"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("should not report let declarations in arrow function declarations", () => {
          valid({
            code: dedent`
              const foo = () => {
                let x;
                let y = 0;
              };
            `,
            options: [{ allowInFunctions: true }],
          });

          const invalidResult = invalid({
            code: dedent`
              let x;
              let y = 0;
            `,
            options: [{ allowInFunctions: true }],
            errors: ["generic", "generic"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("should not report let declarations in method declarations", () => {
          valid({
            code: dedent`
              class Foo {
                foo() {
                  let x;
                  let y = 0;
                }
              }
            `,
            options: [{ allowInFunctions: true }],
          });

          const invalidResult = invalid({
            code: dedent`
              let x;
              let y = 0;
            `,
            options: [{ allowInFunctions: true }],
            errors: ["generic", "generic"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });

      describe("allowInForLoopInit", () => {
        it("should not report let declarations in for loop init", () => {
          valid({
            code: `for (let x = 0; x < 1; x++);`,
            options: [{ allowInForLoopInit: true }],
          });

          const invalidResult = invalid({
            code: dedent`
              let x;
              let y = 0;
            `,
            options: [{ allowInFunctions: true }],
            errors: ["generic", "generic"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });

      describe("ignoreIdentifierPattern", () => {
        it("should not report let declarations with matching identifiers", () => {
          valid({
            code: dedent`
              let mutable;
              let mutableX
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: dedent`
              let mutable = 0;
              let mutableX = 0
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: `for (let mutableX = 0; x < 1; x++);`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: `for (let mutableX in {});`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: `for (let mutableX of []);`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: dedent`
              function foo() {
                let mutableX;
                let mutableY = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: dedent`
              const foo = () => {
                let mutableX;
                let mutableY = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: dedent`
              class Foo {
                foo() {
                  let mutableX;
                  let mutableY = 0;
                }
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          valid({
            code: dedent`
              let Mutable;
              let xMutable;
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: dedent`
              let Mutable = 0;
              let xMutable = 0;
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: `for (let xMutable = 0; xMutable < 1; xMutable++);`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: `for (let xMutable in {});`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: `for (let xMutable of []);`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: dedent`
              function foo() {
                let xMutable;
                let yMutable = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: dedent`
              const foo = () => {
                let xMutable;
                let yMutable = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          valid({
            code: dedent`
              class Foo {
                foo() {
                  let xMutable;
                  let yMutable = 0;
                }
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });
        });

        it("should report non ignored let declarations", () => {
          invalid({
            code: dedent`
              let immutable;
              let immutableX;
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: dedent`
              let immutable = 0;
              let immutableX = 0;
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: `for (let immutableX = 0; immutableX < 1; immutableX++);`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: `for (let immutableX in {});`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: `for (let immutableX of []);`,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: dedent`
              function foo() {
                let immutableX;
                let immutableY = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: dedent`
              const foo = () => {
                let immutableX;
                let immutableY = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: dedent`
              class Foo {
                foo() {
                  let immutableX;
                  let immutableY = 0;
                }
              }
            `,
            options: [{ ignoreIdentifierPattern: "^mutable" }],
          });

          invalid({
            code: dedent`
              let Immutable;
              let xImmutable;
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: dedent`
              let Immutable = 0;
              let xImmutable = 0;
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: `for (let xImmutable = 0; x < 1; x++);`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: `for (let xImmutable in {});`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: `for (let xImmutable of []);`,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: dedent`
              function foo() {
                let xImmutable;
                let yImmutable = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: dedent`
              const foo = () => {
                let xImmutable;
                let yImmutable = 0;
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });

          invalid({
            code: dedent`
              class Foo {
                foo() {
                  let xImmutable;
                  let yImmutable = 0;
                }
              }
            `,
            options: [{ ignoreIdentifierPattern: "Mutable$" }],
          });
        });
      });
    });
  });
});
