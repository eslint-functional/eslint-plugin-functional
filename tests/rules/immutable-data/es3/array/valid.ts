import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Allowed non-array mutation patterns.
  {
    code: dedent`
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
      if (x++) {}`,
    optionsSet: [[]],
  },
  // Allow array non-mutation methods
  {
    code: dedent`
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
      y[0].z.toLocaleString("en", {timeZone: "UTC"});`,
    optionsSet: [[]],
  },
  // Allowed array mutation methods to be chained to the creation of an array.
  {
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
    new Array(5).unshift(6);`,
    optionsSet: [[]],
  },
  // Allowed array mutation methods to be chained to array constructor functions.
  {
    code: dedent`
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
    Array.from({ length: 10 }).unshift(6);`,
    optionsSet: [[]],
  },
  // Allowed array mutation methods to be chained to array accessor/iteration methods.
  {
    code: dedent`
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
    x.reduceRight(function (r, v) { return r.concat([v + 1]); }, []).unshift(6);`,
    optionsSet: [[]],
  },
  // Don't catch calls of array mutation methods on non-array objects.
  {
    code: dedent`
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
      z.unshift();`,
    optionsSet: [[{ assumeTypes: false }]],
  },
  {
    code: dedent`
      var mutableX = [0, 1];
      mutableX.copyWithin(0, 1, 2);
      mutableX.fill(3);
      mutableX.pop();
      mutableX.push(3);
      mutableX.reverse();
      mutableX.shift();
      mutableX.sort();
      mutableX.splice(0, 1, 9);
      mutableX.unshift(6);`,
    optionsSet: [
      [{ ignorePattern: "^mutable" }],
      [{ ignoreAccessorPattern: "mutable*" }],
    ],
  },
];

export default tests;
