import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/no-expression-statements";

import { esLatestConfig, typescriptConfig } from "../utils/configs";

describe(name, () => {
  describe("javascript - es latest", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: esLatestConfig,
    });

    it("reports expression statements", () => {
      const invalidResult = invalid({
        code: dedent`
          var x = [];
          x.push(1);
        `,
        errors: ["generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("doesn't report variable declarations", () => {
      valid(dedent`
        var x = [];
        let y = [];
        const z = [];
      `);
    });

    it("doesn't report directive prologues", () => {
      valid(dedent`
        "use strict";
        "use server";
        "use client";
      `);
    });

    it("doesn't report yield", () => {
      valid(dedent`
        export function* foo() {
          yield "hello";
          return "world";
        }
      `);
    });

    describe("options", () => {
      it("ignoreCodePattern", () => {
        valid({
          code: dedent`
            console.log("yo");
            console.error("yo");
          `,
          options: [{ ignoreCodePattern: "^console\\." }],
        });

        valid({
          code: dedent`
            assert(1 !== 2);
          `,
          options: [{ ignoreCodePattern: "^assert" }],
        });

        const invalidResult = invalid({
          code: `console.trace();`,
          options: [{ ignoreCodePattern: "^console\\.log" }],
          errors: ["generic"],
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

    describe("options", () => {
      it("ignoreVoid", () => {
        valid({
          code: dedent`
            console.log("yo");
            console.error("yo");
          `,
          options: [{ ignoreVoid: true }],
        });

        valid({
          code: dedent`
            function foo() { return Promise.resolve(); }
            foo();
          `,
          options: [{ ignoreVoid: true }],
        });
      });

      it("ignoreSelfReturning", () => {
        valid({
          code: dedent`
            function foo() { return this; }
            foo();
          `,
          options: [{ ignoreSelfReturning: true }],
        });

        valid({
          code: dedent`
            const foo = { bar() { return this; }};
            foo.bar();
          `,
          options: [{ ignoreSelfReturning: true }],
        });

        valid({
          code: dedent`
            class Foo { bar() { return this; }};
            const foo = new Foo();
            foo.bar();
          `,
          options: [{ ignoreSelfReturning: true }],
        });

        const invalidResult = invalid({
          code: dedent`
            const foo = () => { return this; };
            foo();
          `,
          options: [{ ignoreSelfReturning: true }],
          errors: ["generic"],
        });
        expect(invalidResult.messages).toMatchSnapshot();
      });
    });
  });
});
