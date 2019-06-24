/**
 * @fileoverview Tests for no-if-statement
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noIfStatement";
import { es3, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [];

const ruleTester = new RuleTester(typescript);

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
    {
      code: "if (i === 1) { x = 2; }",
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

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});
