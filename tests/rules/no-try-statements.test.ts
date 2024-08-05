import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-try-statements";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", () => {
      valid(dedent`
        foo();
      `);
    });

    it("reports try statements", () => {
      const invalidResult = invalid({
        code: dedent`
          try {
            foo();
          } catch (e) {
            console.log(e);
          }
        `,
        errors: ["catch"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowCatch", () => {
        it("doesn't report try statements with catch", () => {
          valid({
            code: dedent`
              try {
                foo();
              } catch (e) {
                console.log(e);
              }
            `,
            options: [{ allowCatch: true }],
          });
        });

        it("reports try statements with catch and finally", () => {
          const invalidResult = invalid({
            code: dedent`
              try {
                foo();
              } catch (e) {
                console.log(e);
              } finally {
                console.log("world");
              }
            `,
            errors: ["finally"],
            options: [{ allowCatch: true, allowFinally: false }],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });

      describe("allowFinally", () => {
        it("doesn't report try statements with finally", () => {
          valid({
            code: dedent`
              try {
                foo();
              } finally {
                console.log("world");
              }
            `,
            options: [{ allowFinally: true }],
          });
        });

        it("reports try statements with catch and finally", () => {
          const invalidResult = invalid({
            code: dedent`
              try {
                foo();
              } catch (e) {
                console.log(e);
              } finally {
                console.log("world");
              }
            `,
            errors: ["catch"],
            options: [{ allowCatch: false, allowFinally: true }],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });

      it("doesn't report try statements with catch and finally if both are allowed", () => {
        valid({
          code: dedent`
            try {
              foo();
            } catch (e) {
              console.log(e);
            } finally {
              console.log("world");
            }
          `,
          options: [{ allowCatch: true, allowFinally: true }],
        });
      });
    });
  });
});
