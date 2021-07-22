/**
 * @file Tests for no-expression-statement.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-expression-statement";
import { es3, typescript } from "../helpers/configs";
import type { InvalidTestCase, ValidTestCase } from "../helpers/util";
import {
  describeTsOnly,
  processInvalidTestCase,
  processValidTestCase,
} from "../helpers/util";

// Valid test cases.
const es3Valid: ReadonlyArray<ValidTestCase> = [
  // Defining variable should still be allowed.
  {
    code: `var x = [];`,
    optionsSet: [[]],
  },
  // Allowed expressions should not cause failures.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");`,
    optionsSet: [[{ ignorePattern: "^console\\." }]],
  },
  // Allow specifying directive prologues.
  {
    code: `"use strict"`,
    optionsSet: [[]],
  },
];

// Invalid test cases.
const es3Invalid: ReadonlyArray<InvalidTestCase> = [
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
        column: 1,
      },
    ],
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
        column: 1,
      },
    ],
  },
];

// Valid TypeScript test cases.
const tsValid: ReadonlyArray<ValidTestCase> = [
  ...es3Valid,
  // Allowed ignoring void expressions.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");`,
    optionsSet: [[{ ignoreVoid: true }]],
  },
];

// Invalid TypeScript test cases.
const tsInvalid: ReadonlyArray<InvalidTestCase> = [...es3Invalid];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(tsValid),
    invalid: processInvalidTestCase(tsInvalid),
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(es3Valid),
    invalid: processInvalidTestCase(es3Invalid),
  });
});
