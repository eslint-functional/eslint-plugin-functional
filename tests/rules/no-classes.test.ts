import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-classes";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", () => {
      valid("function Foo() {}");
    });

    it("reports class declarations", () => {
      const invalidResult1 = invalid({
        code: "class Foo {}",
        errors: ["generic"],
      });
      expect(invalidResult1.messages).toMatchSnapshot();

      const invalidResult2 = invalid({
        code: "const klass = class {}",
        errors: ["generic"],
      });
      expect(invalidResult2.messages).toMatchSnapshot();
    });
  });
});
