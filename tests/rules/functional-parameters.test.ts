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

    it("doesn't report non-issues", async () => {
      await valid(dedent`
        var foo = {
          arguments: 2
        };
        foo.arguments = 3
      `);

      await valid(dedent`
        (function() {
          console.log("hello world");
        })();
      `);

      await valid(dedent`
        (() => {
          console.log("hello world");
        })();
      `);

      await valid(dedent`
        function foo([bar, ...baz]) {
          console.log(bar, baz);
        }
      `);
    });

    it("reports rest parameter violations", async () => {
      const code = dedent`
        function foo(...bar) {
          console.log(bar);
        }
      `;

      const result = await invalid({
        code,
        errors: ["restParam"],
      });

      expect(result.result).toMatchSnapshot();
    });

    it("reports arguments keyword violations", async () => {
      const code = dedent`
        function foo(bar) {
          console.log(arguments);
        }
      `;

      const result = await invalid({
        code,
        errors: ["arguments"],
      });

      expect(result.result).toMatchSnapshot();
    });

    describe("options", () => {
      describe("enforceParameterCount", () => {
        it("atLeastOne", async () => {
          await valid({
            code: dedent`
              function foo(bar) {
                console.log(bar);
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
          });

          await valid({
            code: dedent`
              function foo(bar, baz) {
                console.log(bar, baz);
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
          });

          await valid({
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

          await valid({
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

          const invalidResult = await invalid({
            code: dedent`
              function foo() {
                console.log("hello world");
              }
            `,
            options: [{ enforceParameterCount: "atLeastOne" }],
            errors: ["paramCountAtLeastOne"],
          });
          expect(invalidResult.result).toMatchSnapshot();
        });

        it("exactlyOne", async () => {
          await valid({
            code: dedent`
              function foo(bar) {
                console.log(bar);
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
          });

          await valid({
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

          await valid({
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

          const invalidResult1 = await invalid({
            code: dedent`
              function foo(bar, baz) {
                console.log(bar, baz);
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
            errors: ["paramCountExactlyOne"],
          });
          expect(invalidResult1.result).toMatchSnapshot();

          const invalidResult2 = await invalid({
            code: dedent`
              function foo() {
                console.log("hello world");
              }
            `,
            options: [{ enforceParameterCount: "exactlyOne" }],
            errors: ["paramCountExactlyOne"],
          });
          expect(invalidResult2.result).toMatchSnapshot();
        });

        it("ignoreLambdaExpression", async () => {
          await valid({
            code: dedent`
              function foo(param) {}
              foo(function () {});
            `,
            options: [{ enforceParameterCount: { ignoreLambdaExpression: true } }],
          });

          await valid({
            code: dedent`
              function foo(param) {}
              foo(() => 1);
            `,
            options: [{ enforceParameterCount: { ignoreLambdaExpression: true } }],
          });

          const invalidResult = await invalid({
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
          expect(invalidResult.result).toMatchSnapshot();
        });

        it("ignoreIIFE", async () => {
          await valid({
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

          const invalidResult = await invalid({
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
          expect(invalidResult.result).toMatchSnapshot();
        });
      });

      it("ignoreIdentifierPattern", async () => {
        await valid({
          code: dedent`
            function foo(...bar) {
              console.log(bar);
            }
          `,
          options: [{ ignoreIdentifierPattern: "^foo" }],
        });

        await valid({
          code: dedent`
            const baz = {
              foo(...bar) {
                console.log(bar);
              }
            }
          `,
          options: [{ ignoreIdentifierPattern: "^foo" }],
        });

        const invalidResult = await invalid({
          code: dedent`
            function foo(...bar) {
              console.log(bar);
            }
          `,
          options: [{ ignoreIdentifierPattern: "^bar" }],
          errors: ["restParam"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("ignorePrefixSelector", async () => {
        await valid({
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

        await valid({
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

        await valid({
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

        await valid({
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

        await valid({
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

        await valid({
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
      it('override value works - "allowRestParameter"', async () => {
        const code = dedent`
          function foo(...bar: string[]) {
            console.log(bar);
          }
        `;

        await valid({
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

      it('override value works - "allowArgumentsKeyword"', async () => {
        const code = dedent`
          function foo(bar: string[]) {
            console.log(arguments);
          }
        `;

        await valid({
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

      it('disbale override works - "allowRestParameter"', async () => {
        const code = dedent`
          function foo(...bar: string[]) {
            console.log(bar);
          }
        `;

        await valid({
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

      it('disbale override works - "allowArgumentsKeyword"', async () => {
        const code = dedent`
          function foo(bar: string[]) {
            console.log(arguments);
          }
        `;

        await valid({
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
