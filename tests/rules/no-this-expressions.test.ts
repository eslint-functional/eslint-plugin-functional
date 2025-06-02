import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-this-expressions";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("reports this expressions", async () => {
      const code = dedent`
        function foo() {
          this.bar();
        }
      `;

      const { result } = await invalid(code);

      expect(result).toMatchSnapshot();
    });

    it("doesn't report non-issues", async () => {
      await valid(dedent`
        function foo() {
          bar();
        }
      `);
    });
  });
});
