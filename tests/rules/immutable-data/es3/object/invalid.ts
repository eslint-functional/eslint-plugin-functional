import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
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
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 5,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 6,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 7,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 8,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 9,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 10,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 11,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 12,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 13,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 14,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 15,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 16,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 17,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 18,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 19,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 20,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 21,
        column: 5,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 22,
        column: 5,
      },
    ],
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
        column: 9,
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 4,
        column: 9,
      },
    ],
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
        column: 1,
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "object",
        type: "CallExpression",
        line: 4,
        column: 1,
      },
    ],
  },
];

export default tests;
