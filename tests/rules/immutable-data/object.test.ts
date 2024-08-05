import dedent from "dedent";
import { createRuleTester } from "eslint-vitest-rule-tester";
import { describe, expect, it } from "vitest";

import { name, rule } from "#/rules/immutable-data";

import { typescriptConfig } from "../../utils/configs";

describe(name, () => {
  describe("typescript", () => {
    const { valid, invalid } = createRuleTester({
      name,
      rule,
      configs: typescriptConfig,
    });

    it("report object mutating patterns", () => {
      const invalidResult = invalid({
        code: dedent`
          var x = {a: 1};
          x.foo = "bar";
          x["foo"] = "bar";
          x.a += 1;
          x.a -= 1;
          x.a *= 1;
          x.a /= 1;
          x.a %= 1;
          x.a <<= 1;
          x.a >>= 1;
          x.a >>>= 1;
          x.a &= 1;
          x.a |= 1;
          x.a ^= 1;
          x.a **= 1;
          delete x.a;
          delete x["a"];
          x.a++;
          x.a--;
          ++x.a;
          --x.a;
          if (x.a = 2) {}
          if (x.a++) {}
          var y = x.a;
          var z = x["a"];
          if (x.a && y.a) {}
          var w = ~x.a;
          if (!x.a) {}
        `,
        errors: [
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
          "generic",
        ],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports Object.assign() on identifiers", () => {
      const invalidResult = invalid({
        code: dedent`
          var x = { msg1: "hello", obj: { a: 1, b: 2} };

          var a = Object.assign(x, { msg2: "world" });
          var b = Object.assign(x.obj, { msg2: "world" });
        `,
        errors: ["object", "object"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports object mutating methods", () => {
      const invalidResult = invalid({
        code: dedent`
          var foo = { a: 1 };
          Object.defineProperties(foo, { b: { value: 2, writable: false }});
          Object.defineProperty(foo, "c", { value: 3, writable: false });
          Object.setPrototypeOf(foo, null);
        `,
        errors: ["object", "object", "object"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("reports field mutation in class methods", () => {
      const invalidResult = invalid({
        code: dedent`
          class Klass {
            bar = 1;

            constructor() {
              this.baz = "hello";
            }

            zoo() {
              this.bar = 2;
              this.baz = 3;
            }
          }
        `,
        errors: ["generic", "generic"],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("doesn't report non-object mutating patterns", () => {
      valid(dedent`
        var foo = function () {};
        var bar = {
          x: 1,
          y: foo
        };
        var x = 0;
        x = 4;
        x += 1;
        x -= 1;
        x++;
        x--;
        ++x;
        --x;
        if (x = 2) {}
        if (x++) {}
        var y = x.a;
        var z = x["a"];
        if (x.a && y.a) {}
        var w = ~x.a;
        if (!x.a) {}
      `);
    });

    it("doesn't report Object.assign() on non-identifiers", () => {
      valid(dedent`
        var x = { msg1: "hello", obj: { a: 1, b: 2}, func: function() {} };
        var bar = function(a, b, c) { return { a: a, b: b, c: c }; };

        var a = Object.assign({}, { msg: "hello world" });
        var b = Object.assign(bar(1, 2, 3), { d: 4 });
        var c = Object.assign(x.func(), { d: 4 });
      `);
    });

    it("doesn't report initialization of class members in constructor", () => {
      valid(dedent`
        class Klass {
          bar = 1;
          constructor() {
            this.baz = "hello";
          }
        }
      `);
    });

    describe("options", () => {
      describe("ignoreNonConstDeclarations", () => {
        it("report variables declared as const", () => {
          const invalidResult = invalid({
            code: dedent`
              const x = {a: 1, b:{}};
              x.foo = "bar";
              x["foo"] = "bar";
              x.a += 1;
              x.a -= 1;
              x.a *= 1;
              x.a /= 1;
              x.a %= 1;
              x.a <<= 1;
              x.a >>= 1;
              x.a >>>= 1;
              x.a &= 1;
              x.a |= 1;
              x.a ^= 1;
              x.a **= 1;
              delete x.a;
              delete x["a"];
              x.a++;
              x.a--;
              ++x.a;
              --x.a;
              if (x.a = 2) {}
              if (x.a++) {}
              Object.assign(x, { c: "world" });
              Object.assign(x.b, { c: "world" });
              Object.defineProperties(x, { d: { value: 2, writable: false }});
              Object.defineProperty(x, "e", { value: 3, writable: false });
              Object.setPrototypeOf(x, null);
            `,
            options: [{ ignoreNonConstDeclarations: true }],
            errors: [
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
            ],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("report parameters", () => {
          const invalidResult = invalid({
            code: dedent`
              function y(x: {a: 1, b: object}) {
                x.foo = "bar";
                x["foo"] = "bar";
                x.a += 1;
                x.a -= 1;
                x.a *= 1;
                x.a /= 1;
                x.a %= 1;
                x.a <<= 1;
                x.a >>= 1;
                x.a >>>= 1;
                x.a &= 1;
                x.a |= 1;
                x.a ^= 1;
                x.a **= 1;
                delete x.a;
                delete x["a"];
                x.a++;
                x.a--;
                ++x.a;
                --x.a;
                if (x.a = 2) {}
                if (x.a++) {}
                Object.assign(x, { c: "world" });
                Object.assign(x.b, { c: "world" });
                Object.defineProperties(x, { d: { value: 2, writable: false }});
                Object.defineProperty(x, "e", { value: 3, writable: false });
                Object.setPrototypeOf(x, null);
              }
            `,
            options: [
              {
                ignoreNonConstDeclarations: {
                  treatParametersAsConst: true,
                },
              },
            ],
            errors: [
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
              "generic",
            ],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("doesn't report variables not declared as const", () => {
          valid({
            code: dedent`
              let x = {a: 1, b:{}};
              x.foo = "bar";
              x["foo"] = "bar";
              x.a += 1;
              x.a -= 1;
              x.a *= 1;
              x.a /= 1;
              x.a %= 1;
              x.a <<= 1;
              x.a >>= 1;
              x.a >>>= 1;
              x.a &= 1;
              x.a |= 1;
              x.a ^= 1;
              x.a **= 1;
              delete x.a;
              delete x["a"];
              x.a++;
              x.a--;
              ++x.a;
              --x.a;
              if (x.a = 2) {}
              if (x.a++) {}
              Object.assign(x, { c: "world" });
              Object.assign(x.b, { c: "world" });
              Object.defineProperties(x, { d: { value: 2, writable: false }});
              Object.defineProperty(x, "e", { value: 3, writable: false });
              Object.setPrototypeOf(x, null);
            `,
            options: [{ ignoreNonConstDeclarations: true }],
          });
        });

        it("doesn't report parameters", () => {
          valid({
            code: dedent`
              function y(x: {a: 1, b: object}) {
                x.foo = "bar";
                x["foo"] = "bar";
                x.a += 1;
                x.a -= 1;
                x.a *= 1;
                x.a /= 1;
                x.a %= 1;
                x.a <<= 1;
                x.a >>= 1;
                x.a >>>= 1;
                x.a &= 1;
                x.a |= 1;
                x.a ^= 1;
                x.a **= 1;
                delete x.a;
                delete x["a"];
                x.a++;
                x.a--;
                ++x.a;
                --x.a;
                if (x.a = 2) {}
                if (x.a++) {}
                Object.assign(x, { c: "world" });
                Object.assign(x.b, { c: "world" });
                Object.defineProperties(x, { d: { value: 2, writable: false }});
                Object.defineProperty(x, "e", { value: 3, writable: false });
                Object.setPrototypeOf(x, null);
              }
            `,
            options: [
              {
                ignoreNonConstDeclarations: {
                  treatParametersAsConst: false,
                },
              },
            ],
          });
        });
      });

      describe("ignoreIdentifierPattern", () => {
        it("ignores variables declared as mutable", () => {
          valid({
            code: dedent`
              var mutableVar = { a: 1 };
              delete mutableVar.a;
              Object.assign(mutableVar, { b: 2 });
            `,
            options: [{ ignoreIdentifierPattern: ["^mutable"] }],
          });
        });
      });

      describe("ignoreAccessorPattern", () => {
        it("ignores variables declared as mutable", () => {
          valid({
            code: dedent`
              function y(mutable_x: {a: 1, b: object}) {
                mutable_x.foo = "bar";
                mutable_x["foo"] = "bar";
                mutable_x.a += 1;
                mutable_x.a -= 1;
                mutable_x.a *= 1;
                mutable_x.a /= 1;
                mutable_x.a %= 1;
                mutable_x.a <<= 1;
                mutable_x.a >>= 1;
                mutable_x.a >>>= 1;
                mutable_x.a &= 1;
                mutable_x.a |= 1;
                mutable_x.a ^= 1;
                mutable_x.a **= 1;
                delete mutable_x.a;
                delete mutable_x["a"];
                mutable_x.a++;
                mutable_x.a--;
                ++mutable_x.a;
                --mutable_x.a;
                if (mutable_x.a = 2) {}
                if (mutable_x.a++) {}
                Object.assign(mutable_x, { c: "world" });
                Object.assign(mutable_x.b, { c: "world" });
                Object.defineProperties(mutable_x, { d: { value: 2, writable: false }});
                Object.defineProperty(mutable_x, "e", { value: 3, writable: false });
                Object.setPrototypeOf(mutable_x, null);
                (mutable_x as Bar).foo = "bar";
                mutable_x!.foo = "bar";
              }
            `,
            options: [
              {
                ignoreNonConstDeclarations: { treatParametersAsConst: true },
                ignoreAccessorPattern: "mutable*.**",
              },
            ],
          });
        });

        it("ignores class fields", () => {
          valid({
            code: dedent`
              class Klass {
                mutate() {
                  this.mutableField = 0;
                }
              }
            `,
            options: [{ ignoreAccessorPattern: ["this.*.**"] }],
          });
        });
      });
    });
  });
});
