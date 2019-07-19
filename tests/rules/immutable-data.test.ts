/**
 * @file Tests for immutable-data
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/immutable-data";

import { es3, es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const objectES3Valid: ReadonlyArray<ValidTestCase> = [
  // Allowed non-object mutation patterns.
  {
    code: dedent`
      var y = x.a;
      var z = x["a"];
      if (x.a && y.a) {}
      var w = ~x.a;
      if (!x.a) {}`,
    optionsSet: [[]]
  },
  // Allow Object.assign() on non identifiers.
  {
    code: dedent`
      var x = { msg1: "hello", obj: { a: 1, b: 2}, func: function() {} };
      var bar = function(a, b, c) { return { a: a, b: b, c: c }; };

      var a = Object.assign({}, { msg: "hello world" });
      var b = Object.assign(bar(1, 2, 3), { d: 4 });
      var c = Object.assign(x.func(), { d: 4 });`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const objectES3Invalid: ReadonlyArray<InvalidTestCase> = [
  // Disallowed object mutation patterns.
  {
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
      delete x.a;
      delete x["a"];
      x.a++;
      x.a--;
      ++x.a;
      --x.a;
      if (x.a = 2) {}
      if (x.a++) {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 2,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 5,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 6,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 7,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 8,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 9,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 10,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 11,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 12,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 13,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 14,
        column: 1
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 15,
        column: 1
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 16,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 17,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 18,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 19,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 20,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 21,
        column: 5
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 22,
        column: 5
      }
    ]
  },
  // Disallow Object.assign on identifers.
  {
    code: dedent`
      var x = { msg1: "hello", obj: { a: 1, b: 2} };

      var a = Object.assign(x, { msg2: "world" });
      var b = Object.assign(x.obj, { msg2: "world" });`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "object",
        type: "CallExpression",
        line: 3,
        column: 9
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 4,
        column: 9
      }
    ]
  },
  // Disallow other object mutation methods.
  {
    code: dedent`
      var foo = { a: 1 };
      Object.defineProperties(foo, { b: { value: 2, writable: false }});
      Object.defineProperty(foo, "c", { value: 3, writable: false });
      Object.setPrototypeOf(foo, null);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "object",
        type: "CallExpression",
        line: 2,
        column: 1
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 4,
        column: 1
      }
    ]
  }
];

/**
 * Valid tests that only apply to es6 and above.
 */
const objectES6Valid: ReadonlyArray<ValidTestCase> = [
  ...objectES3Valid,
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;
        constructor() {
          this.baz = "hello";
        }
      }`,
    optionsSet: [[]]
  }
];

/**
 * Invalid tests that only apply to es6 and above.
 */
const objectES6Invalid: ReadonlyArray<InvalidTestCase> = [
  ...objectES3Invalid,
  {
    code: dedent`
      const x = {a: 1};
      x.a **= 1;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 2,
        column: 1
      }
    ]
  },
  // No mutation in class methods.
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;

        constructor() {
          this.baz = "hello";
        }

        zoo() {
          this.bar = 2;
          this.baz = 3;
        }
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 10,
        column: 5
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 11,
        column: 5
      }
    ]
  }
];

const arrayES3Valid: ReadonlyArray<ValidTestCase> = [
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
    optionsSet: [[]]
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
    optionsSet: [[]]
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
    optionsSet: [[]]
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
    optionsSet: [[]]
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
    optionsSet: [[]]
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
    optionsSet: [[{ assumeTypes: false }]]
  }
];

const arrayES3Invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] = 4;
      y[0].z[0] = 4;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] += 1;
      y[0].z[0] += 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] -= 1;
      y[0].z[0] -= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      delete x[0];
      delete y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0]++;
      y[0].z[0]++;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0]--;
      y[0].z[0]--;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      ++x[0];
      ++y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      --x[0];
      --y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      if (x[0] = 2) {}
      if (y[0].z[0] = 2) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 5
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      if (x[0]++) {}
      if (y[0].z[0]++) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 5
      }
    ]
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x.length = 5;
      y[0].z.length = 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  // Disallowed array mutation methods.
  {
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
      y[0].z.unshift(6);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "array",
        type: "CallExpression",
        line: 2,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 4,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 5,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 6,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 7,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 8,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 9,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 10,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 12,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 13,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 14,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 15,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 16,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 17,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 18,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 19,
        column: 1
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 20,
        column: 1
      }
    ]
  }
];

// Valid test cases.
const arrayES6Valid: ReadonlyArray<ValidTestCase> = [
  ...arrayES3Valid, // Allowed non-array mutation patterns.
  {
    code: dedent`
      const x = 0;
      x *= 1;
      x **= 1;
      x /= 1;
      x %= 1;
      x <<= 1;
      x >>= 1;
      x >>>= 1;
      x &= 1;
      x |= 1;
      x ^= 1;`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const arrayES6Invalid: ReadonlyArray<InvalidTestCase> = [
  ...arrayES3Invalid,

  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] *= 2;
      y[0].z[0] *= 2;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] **= 2;
      y[0].z[0] **= 2;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] /= 1;
      y[0].z[0] /= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] %= 1;
      y[0].z[0] %= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] <<= 1;
      y[0].z[0] <<= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] >>= 1;
      y[0].z[0] >>= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] >>>= 1;
      y[0].z[0] >>>= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] &= 1;
      y[0].z[0] &= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] |= 1;
      y[0].z[0] |= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] ^= 1;
      y[0].z[0] ^= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  }
];

const es3Valid: ReadonlyArray<ValidTestCase> = [
  ...objectES3Valid,
  ...arrayES3Valid
];
const es3Invalid: ReadonlyArray<InvalidTestCase> = [
  ...objectES3Invalid,
  ...arrayES3Invalid
];

const es6Valid: ReadonlyArray<ValidTestCase> = [
  ...objectES6Valid,
  ...arrayES6Valid
];
const es6Invalid: ReadonlyArray<InvalidTestCase> = [
  ...objectES6Invalid,
  ...arrayES6Invalid
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(es3Valid),
    invalid: processInvalidTestCase(es3Invalid)
  });
});
