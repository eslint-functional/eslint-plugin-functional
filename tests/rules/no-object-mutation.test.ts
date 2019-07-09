/**
 * @fileoverview Tests for no-object-mutation
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-object-mutation";

import { es3, es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const es3Valid: ReadonlyArray<ValidTestCase> = [
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
const es3Invalid: ReadonlyArray<InvalidTestCase> = [
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
        messageId: "generic",
        type: "CallExpression",
        line: 3,
        column: 9
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 4,
        column: 9
      }
    ]
  }
];

/**
 * Valid tests that only apply to es6 and above.
 */
const es6Valid: ReadonlyArray<ValidTestCase> = [
  ...es3Valid,
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
const es6Invalid: ReadonlyArray<InvalidTestCase> = [
  ...es3Invalid,
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

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es3Valid),
    invalid: processInvalidTestCase(es3Invalid)
  });
});
