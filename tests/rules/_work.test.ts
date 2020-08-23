/* eslint-disable */
/**
 * @file Provided to help with local test debugging.
 */

import dedent from "dedent";
import {
  ValidTestCase,
  InvalidTestCase,
  processValidTestCase,
  processInvalidTestCase,
} from "../helpers/util";
import { typescript } from "../helpers/configs";
import { RuleTester } from "eslint";

/*
 * Step 1.
 * Import the rule to test.
 */
import { rule } from "../../src/rules/prefer-readonly-type";

/*
 * Step 2a.
 * Provide a valid test case.
 */
const valid: ReadonlyArray<ValidTestCase> = [
  // {
  //   code: dedent`
  //     // Valid Code.
  //   `,
  //   optionsSet: [[]],
  // }
];

/*
 * Step 2b.
 * Or provide an invalid test case.
 */
const invalid: ReadonlyArray<InvalidTestCase> = [
  // {
  //   code: dedent`
  //     // Invalid Code.
  //   `,
  //   optionsSet: [[]],
  //   output: dedent`
  //     // Fixed Code - Remove if rule doesn't have a fixer.
  //   `,
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: "ClassDeclaration",
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
ruleTester.run("Work", rule, {
  valid: processValidTestCase(valid),
  invalid: processInvalidTestCase(invalid),
});
