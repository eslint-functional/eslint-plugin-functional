/**
 * @file Tests for no-throw-statement.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "~/rules/no-throw-statement";
import { es3, typescript } from "~/tests/helpers/configs";
import type { InvalidTestCase, ValidTestCase } from "~/tests/helpers/util";
import {
  describeTsOnly,
  processInvalidTestCase,
  processValidTestCase,
} from "~/tests/helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `throw 'error';`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThrowStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `throw new Error();`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var error = new Error();
      throw error;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 2,
        column: 1,
      },
    ],
  },
];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});
describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});
