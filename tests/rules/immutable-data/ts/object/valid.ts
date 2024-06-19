import dedent from "dedent";

import { type rule } from "#/rules/immutable-data";
import { type OptionsOf, type ValidTestCaseSet } from "#/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Allowed non-object mutation patterns.
  {
    code: dedent`
      var y = x.a;
      var z = x["a"];
      if (x.a && y.a) {}
      var w = ~x.a;
      if (!x.a) {}
    `,
    optionsSet: [[]],
  },
  // Allow Object.assign() on non identifiers.
  {
    code: dedent`
      var x = { msg1: "hello", obj: { a: 1, b: 2}, func: function() {} };
      var bar = function(a, b, c) { return { a: a, b: b, c: c }; };

      var a = Object.assign({}, { msg: "hello world" });
      var b = Object.assign(bar(1, 2, 3), { d: 4 });
      var c = Object.assign(x.func(), { d: 4 });
    `,
    optionsSet: [[]],
  },
  // ignoreIdentifierPattern - objects.
  {
    code: dedent`
      var mutableVar = { a: 1 };
      delete mutableVar.a;
    `,
    optionsSet: [[{ ignoreIdentifierPattern: ["^mutable"] }]],
  },
  {
    code: dedent`
      var mutableVar = { a: 1 };
      Object.assign(mutableVar, { b: 2 });
    `,
    optionsSet: [[{ ignoreIdentifierPattern: ["^mutable"] }]],
  },
  // IgnoreAccessorPattern - objects.
  {
    code: dedent`
      var mutableVar = { a: 1 };
      mutableVar.a = 0;
      mutableVar.a++;
    `,
    optionsSet: [
      [{ ignoreAccessorPattern: ["**.mutable*.a"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.*"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.*.**"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.**"] }],
    ],
  },
  // ignoreNonConstDeclarations.
  {
    code: dedent`
      var mutableVar = { a: 1 };
      mutableVar.a = 0;
      mutableVar.a++;
    `,
    optionsSet: [[{ ignoreNonConstDeclarations: true }]],
  },
  {
    code: dedent`
      let mutableVar = { a: 1 };
      mutableVar.a = 0;
      mutableVar.a++;
    `,
    optionsSet: [[{ ignoreNonConstDeclarations: true }]],
  },
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        constructor() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[]],
  },
  // IgnoreAccessorPattern - classes.
  {
    code: dedent`
      class Klass {
        mutate() {
          this.mutableField = 0;
        }
      }
    `,
    optionsSet: [
      [{ ignoreAccessorPattern: ["this.*.**"] }],
      [{ ignoreAccessorPattern: ["**.mutable*"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.**"] }],
    ],
  },
  // Ignore class
  {
    code: dedent`
      class Klass {
        mutate() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[{ ignoreClasses: true }], [{ ignoreClasses: "fieldsOnly" }]],
  },
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;
        constructor() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[]],
  },
  // ignoreNonConstDeclarations.
  {
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
    optionsSet: [[{ ignoreNonConstDeclarations: true }]],
  },
  {
    code: dedent`
      const y = {x: {a: 1, b:{}}};
      let x = y.x;
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
    optionsSet: [[{ ignoreNonConstDeclarations: true }]],
  },
  {
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
    optionsSet: [
      [{ ignoreNonConstDeclarations: true }],
      [
        {
          ignoreNonConstDeclarations: {
            treatParametersAsConst: false,
          },
        },
      ],
    ],
  },
  {
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
      }
    `,
    optionsSet: [
      [
        {
          ignoreNonConstDeclarations: { treatParametersAsConst: true },
          ignoreAccessorPattern: "mutable*",
        },
      ],
    ],
  },
  {
    code: dedent`
      (mutable_foo as Bar).baz = "hello world";
    `,
    optionsSet: [[{ ignoreAccessorPattern: "mutable*.*" }]],
  },
];

export default tests;
