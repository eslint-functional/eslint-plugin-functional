/**
 * @fileoverview Tests for no-conditional-statement
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-conditional-statement";

import { es3, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      if (i === 1) {
        x = 2;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "if",
        type: "IfStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      var x = "c";
      var y = "";
      switch(x) {
        case "a":
          y = 1;
          break;
        case "b":
          y = 2;
          break;
        default:
          y = 3;
          break;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "switch",
        type: "SwitchStatement",
        line: 3,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
