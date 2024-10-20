import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/functional-parameters";

import { esLatestConfig, typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", () => {
      valid(dedent`
        var foo = {
          arguments: 2
        };
        foo.arguments = 3
      `);

      valid(dedent`
        (function() {
          console.log("hello world");
        })();
      `);

      valid(dedent`
        (() => {
          console.log("hello world");
        })();
      `);

      valid(dedent`
        function foo([bar, ...baz]) {
          console.log(bar, baz);
        }
      `);
    });

    it("reports rest parameter violations", () => {
      const code = dedent`
        function foo(...bar) {
          console.log(bar);
        }
      `;

      const result = invalid({
        code,
        errors: ["restParam"],
      });

      expect(result.messages).toMatchSnapshot();
    });

    it("reports arguments keyword violations", () => {
      const code = dedent`
        function foo(bar) {
          console.log(arguments);
        }
      `;

      const result = invalid({
        code,
        errors: ["arguments"],
      });

      expect(result.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("enforceParameterCount", () => {
        it("atLeastOne", () => {
          valid({
            code: dedent`
              function foo(bar) {
                console.log(bar);
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
          });

          valid({
            code: dedent`
              function foo(bar, baz) {
                console.log(bar, baz);
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
          });

          valid({
            code: dedent`
              const foo = {
                get bar() {
                  return "baz";
                }
              }
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "atLeastOne",
                  ignoreGettersAndSetters: true,
                },
              },
            ],
          });

          valid({
            code: dedent`
              const foo = {
                set bar(baz) {
                  this.baz = baz;
                }
              }
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "atLeastOne",
                  ignoreGettersAndSetters: true,
                },
              },
            ],
          });

          const invalidResult = invalid({
            code: dedent`
              function foo() {
                console.log("hello world");
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
            errors: ["paramCountAtLeastOne"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("exactlyOne", () => {
          valid({
            code: dedent`
              function foo(bar) {
                console.log(bar);
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
          });

          valid({
            code: dedent`
              const foo = {
                get bar() {
                  return "baz";
                }
              }
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "exactlyOne",
                  ignoreGettersAndSetters: true,
                },
              },
            ],
          });

          valid({
            code: dedent`
              const foo = {
                set bar(baz) {
                  this.baz = baz;
                }
              }
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "exactlyOne",
                  ignoreGettersAndSetters: true,
                },
              },
            ],
          });

          const invalidResult1 = invalid({
            code: dedent`
              function foo(bar, baz) {
                console.log(bar, baz);
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
            errors: ["paramCountExactlyOne"],
          });
          expect(invalidResult1.messages).toMatchSnapshot();

          const invalidResult2 = invalid({
            code: dedent`
              function foo() {
                console.log("hello world");
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
            errors: ["paramCountExactlyOne"],
          });
          expect(invalidResult2.messages).toMatchSnapshot();
        });

        it("ignoreLambdaExpression", () => {
          valid({
            code: dedent`
              function foo(param) {}
              foo(function () {});
            `,
            options: [{ enforceParameterCount: { ignoreLambdaExpression: true } }],
          });

          valid({
            code: dedent`
              function foo(param) {}
              foo(() => 1);
            `,
            options: [{ enforceParameterCount: { ignoreLambdaExpression: true } }],
          });

          const invalidResult = invalid({
            code: dedent`
              function foo() {}
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "atLeastOne",
                  ignoreLambdaExpression: true,
                },
              },
            ],
            errors: ["paramCountAtLeastOne"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("ignoreIIFE", () => {
          valid({
            code: dedent`
              (() => {
                console.log("hello world");
              })();
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "atLeastOne",
                  ignoreIIFE: true,
                },
              },
            ],
          });

          const invalidResult = invalid({
            code: dedent`
              (() => {
                console.log("hello world");
              })();
            `,
            options: [
              {
                enforceParameterCount: {
                  count: "atLeastOne",
                  ignoreIIFE: false,
                },
              },
            ],
            errors: ["paramCountAtLeastOne"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });

      it("ignoreIdentifierPattern", () => {
        valid({
          code: dedent`
            function foo(...bar) {
              console.log(bar);
            }
          `,
          options: [{ ignoreIdentifierPattern: "^foo" }],
        });

        valid({
          code: dedent`
            const baz = {
              foo(...bar) {
                console.log(bar);
              }
            }
          `,
          options: [{ ignoreIdentifierPattern: "^foo" }],
        });

        const invalidResult = invalid({
          code: dedent`
            function foo(...bar) {
              console.log(bar);
            }
          `,
          options: [{ ignoreIdentifierPattern: "^bar" }],
          errors: ["restParam"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });

      it("ignorePrefixSelector", () => {
        valid({
          code: dedent`
            [1, 2, 3].reduce(
              function(carry, current) {
                return carry + current;
              },
              0
            );
          `,
          options: [
            {
              ignorePrefixSelector: "CallExpression[callee.property.name='reduce']",
              enforceParameterCount: "exactlyOne",
            },
          ],
        });

        valid({
          code: dedent`
            [1, 2, 3].map(
              function(element, index) {
                return element + index;
              },
              0
            );
          `,
          options: [
            {
              enforceParameterCount: "exactlyOne",
              ignorePrefixSelector: "CallExpression[callee.property.name='map']",
            },
          ],
        });

        valid({
          code: dedent`
            [1, 2, 3]
              .map(
                function(element, index) {
                  return element + index;
                }
              )
              .reduce(
                function(carry, current) {
                  return carry + current;
                },
                0
              );
          `,
          options: [
            {
              enforceParameterCount: "exactlyOne",
              ignorePrefixSelector: [
                "CallExpression[callee.property.name='reduce']",
                "CallExpression[callee.property.name='map']",
              ],
            },
          ],
        });

        valid({
          code: dedent`
            [1, 2, 3].reduce(
              (carry, current) => carry + current,
              0
            );
          `,
          options: [
            {
              enforceParameterCount: "exactlyOne",
              ignorePrefixSelector: "CallExpression[callee.property.name='reduce']",
            },
          ],
        });

        valid({
          code: dedent`
            [1, 2, 3].map(
              (element, index) => element + index,
              0
            );
          `,
          options: [
            {
              enforceParameterCount: "exactlyOne",
              ignorePrefixSelector: "CallExpression[callee.property.name='map']",
            },
          ],
        });

        valid({
          code: dedent`
            [1, 2, 3]
              .map(
                (element, index) => element + index
              )
              .reduce(
                (carry, current) => carry + current, 0
              );
          `,
          options: [
            {
              enforceParameterCount: "exactlyOne",
              ignorePrefixSelector: [
                "CallExpression[callee.property.name='reduce']",
                "CallExpression[callee.property.name='map']",
              ],
            },
          ],
        });
      });
    });
  });

  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    describe("overrides", () => {
      it('override value works - "allowRestParameter"', () => {
        const code = dedent`
          function foo(...bar: string[]) {
            console.log(bar);
          }
        `;

        valid({
          code,
          options: {
            allowRestParameter: false,
            overrides: [
              {
                specifiers: {
                  from: "file",
                },
                options: {
                  allowRestParameter: true,
                },
              },
            ],
          },
        });
      });

      it('override value works - "allowArgumentsKeyword"', () => {
        const code = dedent`
          function foo(bar: string[]) {
            console.log(arguments);
          }
        `;

        valid({
          code,
          options: {
            allowArgumentsKeyword: false,
            overrides: [
              {
                specifiers: {
                  from: "file",
                },
                options: {
                  allowArgumentsKeyword: true,
                },
              },
            ],
          },
        });
      });

      it('disbale override works - "allowRestParameter"', () => {
        const code = dedent`
          function foo(...bar: string[]) {
            console.log(bar);
          }
        `;

        valid({
          code,
          options: {
            allowRestParameter: false,
            overrides: [
              {
                specifiers: {
                  from: "file",
                },
                disable: true,
              },
            ],
          },
        });
      });

      it('disbale override works - "allowArgumentsKeyword"', () => {
        const code = dedent`
          function foo(bar: string[]) {
            console.log(arguments);
          }
        `;

        valid({
          code,
          options: {
            allowArgumentsKeyword: false,
            overrides: [
              {
                specifiers: {
                  from: "file",
                },
                disable: true,
              },
            ],
          },
        });
      });
    });
  });
});
