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

    it("reports array mutations", () => {
      const invalidResult = invalid({
        code: dedent`
          var x = [5, 6];
          var y = [{ z: [3, 7] }];
          x[0] = 4;
          y[0].z[0] = 4;
          x[0] += 1;
          y[0].z[0] += 1;
          delete x[0];
          delete y[0].z[0];
          x[0]++;
          y[0].z[0]++;
          --x[0];
          --y[0].z[0];
          if (x[0] = 2) {}
          if (y[0].z[0] = 2) {}
          x.length = 5;
          y[0].z.length = 1;
        `,
        options: [],
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
        ],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("report mutating array methods", () => {
      const invalidResult = invalid({
        code: dedent`
          var x = [5, 6];
          x.copyWithin(0, 1, 2);
          x.fill(3);
          x.pop();
          x.push(3);
          x.reverse();
          x.shift();
          x.sort();
          x.splice(0, 1, 9);
          x.unshift(6);
          var y = [{ z: [3, 7] }];
          y[0].z.copyWithin(0, 1, 2);
          y[0].z.fill(3);
          y[0].z.pop();
          y[0].z.push(3);
          y[0].z.reverse();
          y[0].z.shift();
          y[0].z.sort();
          y[0].z.splice(0, 1, 9);
          y[0].z.unshift(6);
        `,
        errors: [
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
          "array",
        ],
      });
      expect(invalidResult.messages).toMatchSnapshot();
    });

    it("doesn't report non-mutating array methods", () => {
      valid(dedent`
        var x = [5, 6];
        var y = [{ z: [3, 7] }];

        x.concat([3, 4]);
        x.includes(2);
        x.indexOf(1);
        x.join(', ');
        x.lastIndexOf(0);
        x.slice(1, 2);
        x.toString();
        x.toLocaleString("en", {timeZone: "UTC"});

        y[0].z.concat([3, 4]);
        y[0].z.includes(2);
        y[0].z.indexOf(1);
        y[0].z.join(', ');
        y[0].z.lastIndexOf(0);
        y[0].z.slice(1, 2);
        y[0].z.toString();
        y[0].z.toLocaleString("en", {timeZone: "UTC"});
      `);
    });

    it("allows mutating array methods to be chained to array accessor/iteration methods", () => {
      valid(dedent`
        x.slice().copyWithin(0, 1, 2);
        x.slice().fill(3);
        x.slice().pop();
        x.slice().push(3);
        x.slice().reverse();
        x.slice().shift();
        x.slice().sort();
        x.slice().splice(0, 1, 9);
        x.slice().unshift(6);

        x.concat([1, 2, 3]).copyWithin(0, 1, 2);
        x.concat([1, 2, 3]).fill(3);
        x.concat([1, 2, 3]).pop();
        x.concat([1, 2, 3]).push(3);
        x.concat([1, 2, 3]).reverse();
        x.concat([1, 2, 3]).shift();
        x.concat([1, 2, 3]).sort();
        x.concat([1, 2, 3]).splice(0, 1, 9);
        x.concat([1, 2, 3]).unshift(6);

        x.filter(function (v) { return v > 1; }).copyWithin(0, 1, 2);
        x.filter(function (v) { return v > 1; }).fill(3);
        x.filter(function (v) { return v > 1; }).pop();
        x.filter(function (v) { return v > 1; }).push(3);
        x.filter(function (v) { return v > 1; }).reverse();
        x.filter(function (v) { return v > 1; }).shift();
        x.filter(function (v) { return v > 1; }).sort();
        x.filter(function (v) { return v > 1; }).splice(0, 1, 9);
        x.filter(function (v) { return v > 1; }).unshift(6);

        x.map(function (v) { return v * 2; }).copyWithin(0, 1, 2);
        x.map(function (v) { return v * 2; }).fill(3);
        x.map(function (v) { return v * 2; }).pop();
        x.map(function (v) { return v * 2; }).push(3);
        x.map(function (v) { return v * 2; }).reverse();
        x.map(function (v) { return v * 2; }).shift();
        x.map(function (v) { return v * 2; }).sort();
        x.map(function (v) { return v * 2; }).splice(0, 1, 9);
        x.map(function (v) { return v * 2; }).unshift(6);

        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).copyWithin(0, 1, 2);
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).fill(3);
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).pop();
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).push(3);
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).reverse();
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).shift();
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).sort();
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).splice(0, 1, 9);
        x.reduce(function (r, v) { return r.concat([v + 1]); }, []).unshift(6);

        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).copyWithin(0, 1, 2);
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).fill(3);
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).pop();
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).push(3);
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).reverse();
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).shift();
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).sort();
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).splice(0, 1, 9);
        x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).unshift(6);
      `);
    });

    it("doesn't report mutating array methods on non-array objects", () => {
      valid(dedent`
        var z = {
          copyWithin: function () {},
          fill: function () {},
          pop: function () {},
          push: function () {},
          reverse: function () {},
          shift: function () {},
          sort: function () {},
          splice: function () {},
          unshift: function () {}
        };

        z.copyWithin();
        z.fill();
        z.pop();
        z.push();
        z.reverse();
        z.shift();
        z.sort();
        z.splice();
        z.unshift();
      `);
    });

    describe("options", () => {
      describe("ignoreNonConstDeclarations", () => {
        it("reports variables declared as const", () => {
          const invalidResult = invalid({
            code: dedent`
              const arr = [0, 1];
              arr[0] += 1;
              arr[1]++;
              delete arr[0];
              arr.copyWithin(0, 1, 2);
              arr.fill(3);
              arr.pop();
              arr.push(3);
              arr.reverse();
              arr.shift();
              arr.sort();
              arr.splice(0, 1, 9);
              arr.unshift(6);
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
            errors: [
              "generic",
              "generic",
              "generic",
              "array",
              "array",
              "array",
              "array",
              "array",
              "array",
              "array",
              "array",
              "array",
            ],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });

        it("doesn't report variables not declared as const", () => {
          valid({
            code: dedent`
              let arr = [0, 1];
              arr[0] += 1;
              arr[1]++;
              delete arr[0];
              arr.copyWithin(0, 1, 2);
              arr.fill(3);
              arr.pop();
              arr.push(3);
              arr.reverse();
              arr.shift();
              arr.sort();
              arr.splice(0, 1, 9);
              arr.unshift(6);
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
          });

          valid({
            code: dedent`
              let arr = [0];
              for (const x of [1, 2]) {
                for (const y of [3, 4]) {
                  arr[x][y] += 1;
                  arr[x][y]++;
                  delete arr[x][y];
                  arr[x].copyWithin(x, 1, 2);
                  arr[x].fill(x);
                  arr[x].pop();
                  arr[x].push(x);
                  arr[x].reverse();
                  arr[x].shift();
                  arr[x].sort();
                  arr[x].splice(x, 1, 9);
                  arr[x].unshift(x);
                }
              }
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
          });

          valid({
            code: dedent`
              const constArr = [[0, 1], [2, 3]];
              let arr = constArr[0];
              arr[0] += 1;
              arr[1]++;
              delete arr[0];
              arr.copyWithin(0, 1, 2);
              arr.fill(3);
              arr.pop();
              arr.push(3);
              arr.reverse();
              arr.shift();
              arr.sort();
              arr.splice(0, 1, 9);
              arr.unshift(6);
            `,
            options: [
              {
                ignoreNonConstDeclarations: true,
              },
            ],
          });
        });
      });

      describe("ignoreImmediateMutation", () => {
        it("doesn't report immediately mutation when enabled", () => {
          valid({
            code: dedent`
              [0, 1, 2].copyWithin(0, 1, 2);
              [0, 1, 2].fill(3);
              [0, 1, 2].pop();
              [0, 1, 2].push(3);
              [0, 1, 2].reverse();
              [0, 1, 2].shift();
              [0, 1, 2].sort();
              [0, 1, 2].splice(0, 1, 9);
              [0, 1, 2].unshift(6);

              new Array(5).copyWithin(0, 1, 2);
              new Array(5).fill(3);
              new Array(5).pop();
              new Array(5).push(3);
              new Array(5).reverse();
              new Array(5).shift();
              new Array(5).sort();
              new Array(5).splice(0, 1, 9);
              new Array(5).unshift(6);

              Array.of(0, 1, 2).copyWithin(0, 1, 2);
              Array.of(0, 1, 2).fill(3);
              Array.of(0, 1, 2).pop();
              Array.of(0, 1, 2).push(3);
              Array.of(0, 1, 2).reverse();
              Array.of(0, 1, 2).shift();
              Array.of(0, 1, 2).sort();
              Array.of(0, 1, 2).splice(0, 1, 9);
              Array.of(0, 1, 2).unshift(6);

              Array.from({ length: 10 }).copyWithin(0, 1, 2);
              Array.from({ length: 10 }).fill(3);
              Array.from({ length: 10 }).pop();
              Array.from({ length: 10 }).push(3);
              Array.from({ length: 10 }).reverse();
              Array.from({ length: 10 }).shift();
              Array.from({ length: 10 }).sort();
              Array.from({ length: 10 }).splice(0, 1, 9);
              Array.from({ length: 10 }).unshift(6);
            `,
            options: [
              {
                ignoreImmediateMutation: true,
              },
            ],
          });

          valid({
            code: dedent`
              Object.entries({}).sort();
              Object.keys({}).sort();
              Object.values({}).sort();
            `,
            options: [
              {
                ignoreImmediateMutation: true,
              },
            ],
          });

          valid({
            code: dedent`
              "foo".split("").sort();
              const bar = "bar";
              bar.split("").sort();
              ([a, b, c] as string[]).sort();
            `,
            options: [
              {
                ignoreImmediateMutation: true,
              },
            ],
          });
        });

        it("reports immediately mutation when disabled", () => {
          const invalidResult = invalid({
            code: dedent`
              [0, 1, 2].sort();
              new Array(5).sort();
              Array.of(0, 1, 2).sort();
              Array.from({ length: 10 }).sort();
            `,
            options: [
              {
                ignoreImmediateMutation: false,
              },
            ],
            errors: ["array", "array", "array", "array"],
          });
          expect(invalidResult.messages).toMatchSnapshot();
        });
      });
    });
  });
});
