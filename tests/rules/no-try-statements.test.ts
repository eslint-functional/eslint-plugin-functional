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

    it("doesn't report non-issues", async () => {
      await valid(dedent`
        foo();
      `);
    });

    it("reports try statements", async () => {
      const invalidResult = await invalid({
        code: dedent`
          try {
            foo();
          } catch (e) {
            console.log(e);
          }
        `,
        errors: ["catch"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    describe("options", () => {
      describe("allowCatch", () => {
        it("doesn't report try statements with catch", async () => {
          await valid({
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

        it("reports try statements with catch and finally", async () => {
          const invalidResult = await invalid({
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
          expect(invalidResult.result).toMatchSnapshot();
        });
      });

      describe("allowFinally", () => {
        it("doesn't report try statements with finally", async () => {
          await valid({
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

        it("reports try statements with catch and finally", async () => {
          const invalidResult = await invalid({
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
          expect(invalidResult.result).toMatchSnapshot();
        });
      });

      it("doesn't report try statements with catch and finally if both are allowed", async () => {
        await valid({
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
