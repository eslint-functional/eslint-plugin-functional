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

    it("doesn't report property signatures in interfaces", async () => {
      await valid(dedent`
        interface Foo {
          bar: (a: number, b: string) => number;
        }
      `);
    });

    it("doesn't report property signatures in type literals", async () => {
      await valid(dedent`
        type Foo = {
          bar: (a: number, b: string) => number;
        }
      `);
    });

    it("reports method signatures in interfaces", async () => {
      const invalidResult = await invalid({
        code: dedent`
          interface Foo {
            bar(a: number, b: string): number;
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    it("reports method signatures in type literals", async () => {
      const invalidResult = await invalid({
        code: dedent`
          type Foo = {
            bar(a: number, b: string): number;
          }
        `,
        errors: ["generic"],
      });
      expect(invalidResult.result).toMatchSnapshot();
    });

    describe("options", () => {
      describe("ignoreIfReadonlyWrapped", () => {
        it("doesn't report method signatures wrapped in Readonly in interfaces", async () => {
          await valid({
            code: dedent`
              interface Foo extends Readonly<{
                methodSignature(): void
              }>{}
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly in type literals", async () => {
          await valid({
            code: dedent`
              type Foo = Readonly<{
                methodSignature(): void
              }>
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly that are intersepted", async () => {
          await valid({
            code: dedent`
              type Foo = Bar & Readonly<Baz & {
                methodSignature(): void
              }>
            `,
            options: [{ ignoreIfReadonlyWrapped: true }],
          });
        });

        it("doesn't report method signatures wrapped in Readonly that are intersepted and nested", async () => {
          await valid({
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

        it("doesn't report method signatures wrapped in Readonly that are intersepted and deeply nested", async () => {
          await valid({
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
