/**
 * @fileoverview Tests for no-class
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noClass";
import { es6, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: "class Foo {}",
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: "const klass = class {}",
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 15
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
