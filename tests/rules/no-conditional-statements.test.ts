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
      it("reports if statements", async () => {
        const invalidResult = await invalid({
          code: dedent`
            if (true) {
              console.log("hello world");
            }
          `,
          errors: ["unexpectedIf"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      describe("options", () => {
        describe("allowReturningBranches", () => {
          describe("true", () => {
            it("allows return", async () => {
              await valid({
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

            it("supports break and continue as returning", async () => {
              await valid({
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

            it("supports throw as returning", async () => {
              await valid({
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

            it("supports never as returning", async () => {
              await valid({
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
            it("else required", async () => {
              await valid({
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

              const invalidResult = await invalid({
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
              expect(invalidResult.result).toMatchSnapshot();
            });

            it("supports break and continue as returning", async () => {
              await valid({
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

        describe("ignoreCodePattern", () => {
          it("ignores matching conditionals", async () => {
            await valid({
              code: dedent`
                if (import.meta.vitest) {
                  const { it, expect } = import.meta.vitest;
                }
              `,
              options: [{ ignoreCodePattern: ["import\\.meta\\.vitest"] }],
            });
          });
        });
      });
    });

    describe("switch statements", () => {
      it("reports switch statements", async () => {
        const invalidResult = await invalid({
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
        expect(invalidResult.result).toMatchSnapshot();
      });

      describe("options", () => {
        describe("allowReturningBranches", () => {
          describe("true", () => {
            it("allows return", async () => {
              await valid({
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

            it("supports break and continue as returning", async () => {
              await valid({
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

            it("supports throw as returning", async () => {
              await valid({
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

            it("supports never as returning", async () => {
              await valid({
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
            it("requires default case", async () => {
              await valid({
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

              const invalidResult = await invalid({
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
              expect(invalidResult.result).toMatchSnapshot();
            });

            it("supports exhaustive type testing", async () => {
              await valid({
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
