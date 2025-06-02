import dedent from "dedent";
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

    it("doesn't report non-issues", async () => {
      await valid("function Foo() {}");
    });

    it("reports class declarations", async () => {
      const invalidResult1 = await invalid({
        code: "class Foo {}",
        errors: ["generic"],
      });
      expect(invalidResult1.result).toMatchSnapshot();

      const invalidResult2 = await invalid({
        code: "const klass = class {}",
        errors: ["generic"],
      });
      expect(invalidResult2.result).toMatchSnapshot();
    });

    describe("options", () => {
      describe("ignoreIdentifierPattern", () => {
        it("should not report classes with matching identifiers", async () => {
          await valid({
            code: dedent`
              class Foo {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
          });
        });

        it("should report classes with non-matching identifiers", async () => {
          const invalidResult = await invalid({
            code: dedent`
              class Bar {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
            errors: ["generic"],
          });
          expect(invalidResult.result).toMatchSnapshot();
        });
      });
    });

    describe("ignoreCodePattern", () => {
      it("should not report classes with matching identifiers", async () => {
        await valid({
          code: dedent`
            class Foo {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
        });
      });

      it("should report classes with non-matching identifiers", async () => {
        const invalidResult = await invalid({
          code: dedent`
            class Bar {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
          errors: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });
    });
  });
});
