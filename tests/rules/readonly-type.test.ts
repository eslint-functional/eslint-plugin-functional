import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/readonly-type";

import { typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    describe("generic", () => {
      it("doesn't report Readonly wrapped types", async () => {
        await valid({
          code: "type Foo = Readonly<{ a: Readonly<{ x: number }> }>;",
          options: ["generic"],
        });
      });

      it("reports readonly keywords", async () => {
        const invalidResult = await invalid({
          code: "type Foo = { readonly a: number; readonly b: string };",
          output: "type Foo = Readonly<{ a: number; b: string }>;",
          errors: ["generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("reports redundant readonly keywords directly inside Readonly", async () => {
        const invalidResult = await invalid({
          code: "type Foo = Readonly<{ readonly x: number }>;",
          output: "type Foo = Readonly<{ x: number }>;",
          errors: ["generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("reports redundant readonly keywords inside an intersection inside Readonly", async () => {
        const invalidResult = await invalid({
          code: "type Foo = Readonly<{ readonly x: number } & { readonly y: string }>;",
          output: "type Foo = Readonly<{ x: number } & { y: string }>;",
          errors: ["generic", "generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("wraps nested type literals that aren't inside Readonly", async () => {
        const invalidResult = await invalid({
          code: "type Foo = { a: { readonly x: number } };",
          output: "type Foo = { a: Readonly<{ x: number }> };",
          errors: ["generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("wraps type literals nested in a property of a Readonly type", async () => {
        const invalidResult = await invalid({
          code: "type Foo = Readonly<{ a: { readonly x: number } }>;",
          output: "type Foo = Readonly<{ a: Readonly<{ x: number }> }>;",
          errors: ["generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("keeps nested type literals readonly when fixing", async () => {
        const invalidResult = await invalid({
          code: "type Foo = { readonly a: { readonly x: number } };",
          output: "type Foo = Readonly<{ a: Readonly<{ x: number }> }>;",
          errors: ["generic", "generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("keeps deeply nested type literals readonly when fixing", async () => {
        const invalidResult = await invalid({
          code: "type Foo = { readonly a: { readonly b: { readonly c: number } } };",
          output: "type Foo = Readonly<{ a: Readonly<{ b: Readonly<{ c: number }> }> }>;",
          errors: ["generic", "generic", "generic"],
          options: ["generic"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });
    });

    describe("keyword", () => {
      it("doesn't report readonly keywords", async () => {
        await valid({
          code: "type Foo = { readonly a: { readonly x: number } };",
          options: ["keyword"],
        });
      });

      it("reports Readonly wrapped types", async () => {
        const invalidResult = await invalid({
          code: "type Foo = Readonly<{ x: number }>;",
          output: "type Foo = { readonly x: number };",
          errors: ["keyword"],
          options: ["keyword"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });

      it("doesn't treat type literals nested in a property as Readonly wrapped", async () => {
        const invalidResult = await invalid({
          code: "type Foo = Readonly<{ a: { x: number } }>;",
          output: "type Foo = { readonly a: { x: number } };",
          errors: ["keyword"],
          options: ["keyword"],
        });
        expect(invalidResult.result).toMatchSnapshot();
      });
    });
  });
});
