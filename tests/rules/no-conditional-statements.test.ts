import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-conditional-statements";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    describe("if statements", () => {
      it("reports if statements", () => {
        const invalidResult = invalid({
          code: dedent`
            if (true) {
              console.log("hello world");
            }
          `,
          errors: ["unexpectedIf"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });

      describe("options", () => {
        describe("allowReturningBranches", () => {
          describe("true", () => {
            it("allows return", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    if (i === 1) {
                      return 1;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports break and continue as returning", () => {
              valid({
                code: dedent`
                  for(var i = 0; i < j; i++) {
                    if (e === 1) {
                      break;
                    }
                    if (e === 2) {
                      continue;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports throw as returning", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    if (i === 1) {
                      throw 1;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports never as returning", () => {
              valid({
                code: dedent`
                  declare function neverReturn(): never;
                  function foo(i) {
                    if (i === 1) {
                      neverReturn();
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });
          });

          describe("ifExhaustive", () => {
            it("else required", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    if (i === 1) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
              });

              const invalidResult = invalid({
                code: dedent`
                  function foo(i) {
                    if (i === 1) {
                      return 1;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
                errors: ["incompleteIf"],
              });
              expect(invalidResult.messages).toMatchSnapshot();
            });

            it("supports break and continue as returning", () => {
              valid({
                code: dedent`
                  for(var i = 0; i < j; i++) {
                    if (e === 1) {
                      break;
                    } else {
                      continue;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
              });
            });
          });
        });
      });
    });

    describe("switch statements", () => {
      it("reports switch statements", () => {
        const invalidResult = invalid({
          code: dedent`
            switch(i) {
              case "a":
                console.log("hello");
              case "b":
              case "c":
                console.log("world");
            }
          `,
          errors: ["unexpectedSwitch"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });

      describe("options", () => {
        describe("allowReturningBranches", () => {
          describe("true", () => {
            it("allows return", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    switch(i) {
                      case "a":
                        return 1;
                      case "b":
                        return 2;
                      default:
                        return 3;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports break and continue as returning", () => {
              valid({
                code: dedent`
                  label: for(var i = 0; i < j; i++) {
                    switch(i) {
                      case "a":
                        break label;
                      case "b":
                        continue;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports throw as returning", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    switch(i) {
                      case "a":
                        throw 1;
                      case "b":
                        throw 2;
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });

            it("supports never as returning", () => {
              valid({
                code: dedent`
                  declare function neverReturn(): never;
                  function foo(i) {
                    switch(i) {
                      case "a":
                        neverReturn();
                      case "b":
                        neverReturn();
                    }
                  }
                `,
                options: [{ allowReturningBranches: true }],
              });
            });
          });

          describe("ifExhaustive", () => {
            it("requires default case", () => {
              valid({
                code: dedent`
                  function foo(i) {
                    switch(i) {
                      case "a":
                        return 1;
                      case "b":
                        return 2;
                      default:
                        return 3;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
              });

              const invalidResult = invalid({
                code: dedent`
                  function foo(i) {
                    switch(i) {
                      case "a":
                        return 1;
                      case "b":
                        return 2;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
                errors: ["incompleteSwitch"],
              });
              expect(invalidResult.messages).toMatchSnapshot();
            });

            it("supports exhaustive type testing", () => {
              valid({
                code: dedent`
                  type T = "a" | "b";
                  function foo(i: T) {
                    switch(i) {
                      case "a":
                        return 1;
                      case "b":
                        return 2;
                    }
                  }
                `,
                options: [{ allowReturningBranches: "ifExhaustive" }],
              });
            });
          });
        });
      });
    });
  });
});
