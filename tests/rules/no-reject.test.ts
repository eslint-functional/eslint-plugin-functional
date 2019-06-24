/**
 * @fileoverview Tests for no-reject
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noReject";
import { es6, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [
  dedent`
    function bar() {
      if (Math.random() > 0.5) {
          return Promise.resolve(new Error("foo"))
      }
      return Promise.resolve(10)
    }`
];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: dedent`
      function foo() {
        if (Math.random() > 0.5) {
            return Promise.reject(new Error("bar"))
        }
        return Promise.resolve(10)
      }`,
    errors: [
      {
        messageId: "generic",
        line: 3,
        column: 14
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
