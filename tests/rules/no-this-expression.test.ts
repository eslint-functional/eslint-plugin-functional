/**
 * @file Tests for no-this-expression.
 */

import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-this-expression";

import { es3, typescript } from "../helpers/configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  tsInstalled,
  ValidTestCase
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `this.x = 0;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThisExpression",
        line: 1,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  if (tsInstalled()) {
    const ruleTester = new RuleTester(typescript);
    ruleTester.run(name, rule, {
      valid: processValidTestCase(valid),
      invalid: processInvalidTestCase(invalid)
    });
  } else {
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("TypeScript is not installed.", () => {});
  }
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
