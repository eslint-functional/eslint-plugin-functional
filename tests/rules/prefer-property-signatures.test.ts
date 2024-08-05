import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/prefer-property-signatures";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("doesn't report property signatures in interfaces", () => {
      valid(dedent`
        interface Foo {
          bar: (a: number, b: string) => number;
        }
      `);
    });

    it("doesn't report property signatures in type literals", () => {
      valid(dedent`
        type Foo = {
          bar: (a: number, b: string) => number;
        }
      `);
    });

    it("reports method signatures in interfaces", () => {
      const invalidResult = invalid({
        code: dedent`
          interface Foo {
            bar(a: number, b: string): number;
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports method signatures in type literals", () => {
      const invalidResult = invalid({
        code: dedent`
          type Foo = {
            bar(a: number, b: string): number;
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    describe("options", () => {
      describe("ignoreIfReadonlyWrapped", () => {
        it("doesn't report method signatures wrapped in Readonly in interfaces", () => {
          valid({
            code: dedent`
              interface Foo extends Readonly<{
                methodSignature(): void
              }>{}
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly in type literals", () => {
          valid({
            code: dedent`
              type Foo = Readonly<{
                methodSignature(): void
              }>
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly that are intersepted", () => {
          valid({
            code: dedent`
              type Foo = Bar & Readonly<Baz & {
                methodSignature(): void
              }>
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly that are intersepted and nested", () => {
          valid({
            code: dedent`
              type Foo = Bar & Readonly<Baz & {
                nested: Readonly<{
                  methodSignature(): void
                }>
              }>
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly that are intersepted and deeply nested", () => {
          valid({
            code: dedent`
              interface Foo extends Bar, Readonly<Baz & {
                readonly nested: {
                  deepNested: Readonly<{
                    methodSignature(): void
                  }>
                }
              }>{}
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });
      });
    });
  });
});
