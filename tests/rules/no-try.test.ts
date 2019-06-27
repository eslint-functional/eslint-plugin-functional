/**
 * @fileoverview Tests for no-try
 */

import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noTry";

import { es3, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TryStatement",
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
