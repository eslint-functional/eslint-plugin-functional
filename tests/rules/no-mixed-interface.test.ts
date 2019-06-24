/**
 * @fileoverview Tests for no-mixed-interface
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noTSMixedInterface";
import { typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [
  // Only properties should not produce failures.
  dedent`
    interface Foo {
      bar: string;
      zoo: number;
    }`,
  // Only functions should not produce failures
  dedent`
    interface Foo {
      bar(): string;
      zoo(): number;
    }`,
  // Only indexer should not produce failures
  dedent`
    interface Foo {
      [key: string]: string;
    }`
];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  // Mixing properties and methods (MethodSignature) should produce failures.
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    errors: [
      {
        messageId: "generic",
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
    errors: [
      {
        messageId: "generic",
        line: 3,
        column: 3
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});
