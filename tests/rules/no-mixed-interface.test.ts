/**
 * @fileoverview Tests for no-mixed-interface
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noMixedInterface";

import { typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [
  // Only properties should not produce failures.
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[]]
  },
  // Only functions should not produce failures
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[]]
  },
  // Only indexer should not produce failures
  {
    code: dedent`
      interface Foo {
        [key: string]: string;
      }`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  // Mixing properties and methods (MethodSignature) should produce failures.
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 3,
        column: 3
      }
    ]
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
