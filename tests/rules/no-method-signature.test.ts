/**
 * @file Tests for no-method-signature.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "~/rules/no-method-signature";
import { typescript } from "~/tests/helpers/configs";
import type { InvalidTestCase, ValidTestCase } from "~/tests/helpers/util";
import {
  describeTsOnly,
  processInvalidTestCase,
  processValidTestCase,
} from "~/tests/helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar: (a: number, b: string) => number;
      }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo2 = {
        bar: (a: number, b: string) => number
      }`,
    optionsSet: [[]],
  },
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
        column: 3,
      },
    ],
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
        column: 3,
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
