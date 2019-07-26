/**
 * @file Provided to help with local test debugging.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

/*
 * Step 1.
 * Import the rule to test.
 */
import { rule } from "../../src/rules/prefer-readonly-type";

import { typescript } from "../helpers/configs";

/*
 * Step 2a.
 * Provide a valid test case.
 */
const valid: ReadonlyArray<string | RuleTester.ValidTestCase> = [
  // {
  //   code: dedent`
  //     // Code
  //   `,
  //   options: []
  // }
];

/*
 * Step 2b.
 * Or provide an invalid test case.
 */
const invalid: ReadonlyArray<RuleTester.InvalidTestCase> = [
  // {
  //   code: dedent`
  //     // Code
  //   `,
  //   options: [],
  //   output: dedent`
  //     // Fixed Code - Remove member if rule doesn't have a fixer
  //   `,
  //   errors: [
  //     {
  //       messageId: "generic",
  //       line: 2,
  //       column: 8
  //     }
  //   ]
  // }
];

/*
 * Step 3.
 * Run test with `yarn test-work` or to debug in vscode, press F5 (with this
 * file open and focused).
 */
const ruleTester = new RuleTester(typescript);
ruleTester.run(
  dedent`
    Work`,
  rule,
  {
    valid: [...valid],
    invalid: [...invalid]
  }
);
