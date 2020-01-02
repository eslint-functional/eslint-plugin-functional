/**
 * @file Tests for no-method-signature.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-method-signature";

import { typescript } from "../helpers/configs";
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
      interface Foo {
        bar: (a: number, b: string) => number;
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      type Foo2 = {
        bar: (a: number, b: string) => number
      }`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      type Foo2 = {
        bar(a: number, b: string): number
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3
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
