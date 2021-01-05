import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Allowed non-object mutation patterns.
  {
    code: dedent`
      var y = x.a;
      var z = x["a"];
      if (x.a && y.a) {}
      var w = ~x.a;
      if (!x.a) {}`,
    optionsSet: [[]],
  },
  // Allow Object.assign() on non identifiers.
  {
    code: dedent`
      var x = { msg1: "hello", obj: { a: 1, b: 2}, func: function() {} };
      var bar = function(a, b, c) { return { a: a, b: b, c: c }; };

      var a = Object.assign({}, { msg: "hello world" });
      var b = Object.assign(bar(1, 2, 3), { d: 4 });
      var c = Object.assign(x.func(), { d: 4 });`,
    optionsSet: [[]],
  },
  // IgnorePattern - objects.
  {
    code: dedent`
      var mutableVar = { a: 1 };
      delete mutableVar.a;`,
    optionsSet: [[{ ignorePattern: ["^mutable"] }]],
  },
  {
    code: dedent`
      var mutableVar = { a: 1 };
      Object.assign(mutableVar, { b: 2 });`,
    optionsSet: [[{ ignorePattern: ["^mutable"] }]],
  },
  // IgnoreAccessorPattern - objects.
  {
    code: dedent`
      var mutableVar = { a: 1 };
      mutableVar.a = 0;
      mutableVar.a++;`,
    optionsSet: [
      [{ ignoreAccessorPattern: ["**.mutable*.a"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.*"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.*.**"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.**"] }],
    ],
  },
];

export default tests;
