/**
 * @file Tests for no-promise-reject.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-promise-reject";

import { es6, typescript } from "../helpers/configs";
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
    code: dedent`
      function bar() {
        if (Math.random() > 0.5) {
            return Promise.resolve(new Error("foo"))
        }
        return Promise.resolve(10)
      }`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo() {
        if (Math.random() > 0.5) {
            return Promise.reject(new Error("bar"))
        }
        return Promise.resolve(10)
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "CallExpression",
        line: 3,
        column: 14
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

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
