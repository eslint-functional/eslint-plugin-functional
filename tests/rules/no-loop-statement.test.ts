/**
 * @fileoverview Tests for no-loop
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noLoopStatement";
import { es3, es6, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `for (const x = 0; x < 10; x++) { console.log(x); }`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (const x in y) { console.log(x); }`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (const x of y) { console.log(x); }`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `while (true) { console.log("a"); }`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `do { console.log("a"); } while (true)`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: [],
    invalid: [
      {
        code: `for (var x = 0; x < 10; x++) { console.log(x); }`,
        errors: [
          {
            messageId: "generic",
            line: 1,
            column: 1
          }
        ]
      },
      {
        code: `while (true) { console.log("a"); }`,
        errors: [
          {
            messageId: "generic",
            line: 1,
            column: 1
          }
        ]
      },
      {
        code: `do { console.log("a"); } while (true)`,
        errors: [
          {
            messageId: "generic",
            line: 1,
            column: 1
          }
        ]
      }
    ]
  });
});
