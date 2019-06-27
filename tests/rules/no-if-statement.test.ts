/**
 * @fileoverview Tests for no-if-statement
 */

import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noIfStatement";

import { es3, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  {
    code: "if (i === 1) { x = 2; }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "IfStatement",
        line: 1,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
