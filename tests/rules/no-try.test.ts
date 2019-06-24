/**
 * @fileoverview Tests for no-try
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noTry";
import { es3, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [`var x = 0;`];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `try {} catch (e) {}`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} catch (e) {} finally {}`,
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} finally {}`,
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

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});
