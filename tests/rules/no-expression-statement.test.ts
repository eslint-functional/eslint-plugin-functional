/**
 * @file Tests for no-expression-statement.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-expression-statement";

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
  // Defining variable should still be allowed.
  {
    code: `var x = [];`,
    optionsSet: [[]]
  },
  // Allowed expressions should not cause failures.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");`,
    optionsSet: [[{ ignorePattern: "^console\\." }]]
  },
  // Allow specifying directive prologues.
  {
    code: `"use strict"`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      var x = [];
      x.push(1);`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
        line: 2,
        column: 1
      }
    ]
  },
  // Non-allowed expressions should cause failures.
  {
    code: `console.trace();`,
    optionsSet: [[{ ignorePattern: "^console\\.log" }]],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
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
  }
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
