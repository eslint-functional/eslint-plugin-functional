import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-loop-statements";

import { esLatestConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", () => {
      valid({
        code: dedent`
          if (true) {
            console.log("hello world");
          }
        `,
      });
    });

    it("reports while loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          while (true) {
            console.log("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports do while loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          do {
            console.log("hello world");
          } while (true);
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports for loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          for (let i = 0; i < 10; i++) {
            console.log("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports for in loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          for (let i in []) {
            console.log("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports for of loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          for (let i of []) {
            console.log("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports for await loop statements", () => {
      const invalidResult = invalid({
        code: dedent`
          for await (let i of []) {
            console.log("hello world");
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });
  });
});
