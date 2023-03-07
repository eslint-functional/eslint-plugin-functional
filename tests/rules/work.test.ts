/* eslint-disable */
/**
 * @file Provided to help with local test debugging.
 */

import dedent from "dedent";
import type { ValidTestCase, InvalidTestCase } from "../helpers/util";
import { testUsing } from "~/tests/helpers/testers";

/*
 * Step 1.
 * Import the rule to test.
 */
import { name, rule } from "~/rules/prefer-immutable-types";

/*
 * Step 2a.
 * Provide a valid test case.
 */
const valid: Array<ValidTestCase> = [
  // {
  //   code: dedent`
  //     // Valid Code.
  //   `,
  //   optionsSet: [[]],
  //   settingsSet: [{}],
  // }
];

/*
 * Step 2b.
 * Or provide an invalid test case.
 */
const invalid: Array<InvalidTestCase> = [
  // {
  //   code: dedent`
  //     // Invalid Code.
  //  `,
  //   optionsSet: [[]],
  //   settingsSet: [{}],
  //   errors: [
  //     {
  //       messageId: "returnType",
  //       type: "TSTypeAnnotation",
  //       line: 1,
  //       column: 1,
  //     },
  //   ],
  // },
];

/*
 * Step 3.
 * Run test with `pnpm run test-work` or to debug in vscode, press F5 (with this
 * file open and focused).
 */
testUsing.typescript(name, rule, { valid, invalid });
