/**
 * @fileoverview Tests for no-this
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noThis";
import { es3, typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [`var x = 0;`];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `this.x = 0;`,
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
