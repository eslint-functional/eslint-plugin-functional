import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-throw-statements";

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
        function foo() {
          bar();
        }
      `);
    });

    it("reports throw statements of strings", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo() {
            throw 'error';
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports throw statements of Errors", () => {
      const invalidResult = invalid({
        code: dedent`
          function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports throw statements in async functions", () => {
      const invalidResult = invalid({
        code: dedent`
          async function foo() {
            throw new Error();
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });
  });
});
