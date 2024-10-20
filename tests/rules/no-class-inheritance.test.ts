import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-class-inheritance";

import { esLatestConfig, typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("doesn't report non-issues", () => {
      valid("class Foo {}");
    });

    it("reports class inheritance", () => {
      const invalidResult1 = invalid({
        code: "class Foo extends Bar {}",
        errors: ["extends"],
      });
      expect(invalidResult1.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("ignoreIdentifierPattern", () => {
        it("should not report class inheritance with matching identifiers", () => {
          valid({
            code: dedent`
              class Foo extends Bar {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
          });
        });

        it("should report class inheritance with non-matching identifiers", () => {
          const invalidResult = invalid({
            code: dedent`
              class Bar extends Foo {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
            errors: ["extends"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });
    });

    describe("ignoreCodePattern", () => {
      it("should not report class inheritance with matching identifiers", () => {
        valid({
          code: dedent`
            class Foo extends Bar {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
        });
      });

      it("should report class inheritance with non-matching identifiers", () => {
        const invalidResult = invalid({
          code: dedent`
            class Bar extends Foo {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
          errors: ["extends"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });
    });
  });

  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("doesn't report non-issues", () => {
      valid("class Foo {}");
      valid("class Foo implements Bar {}");
      valid("interface Foo extends Bar {}");
    });

    it("reports class inheritance", () => {
      const invalidResult1 = invalid({
        code: "abstract class Foo {}",
        errors: ["abstract"],
      });
      expect(invalidResult1.messages).toMatchSnapshot();

      const invalidResult2 = invalid({
        code: "abstract class Foo extends Bar {}",
        errors: ["abstract", "extends"],
      });
      expect(invalidResult2.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("ignoreIdentifierPattern", () => {
        it("should not report class inheritance with matching identifiers", () => {
          valid({
            code: dedent`
              abstract class Foo {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
          });
        });

        it("should report class inheritance with non-matching identifiers", () => {
          const invalidResult = invalid({
            code: dedent`
              abstract class Bar {}
            `,
            options: [{ ignoreIdentifierPattern: "^Foo$" }],
            errors: ["abstract"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });
    });

    describe("ignoreCodePattern", () => {
      it("should not report class inheritance with matching identifiers", () => {
        valid({
          code: dedent`
            abstract class Foo {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
        });
      });

      it("should report class inheritance with non-matching identifiers", () => {
        const invalidResult = invalid({
          code: dedent`
            abstract class Bar {}
          `,
          options: [{ ignoreCodePattern: "class Foo" }],
          errors: ["abstract"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });
    });
  });
});
