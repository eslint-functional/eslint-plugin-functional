/**
 * @fileoverview Tests for no-method-signature
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noTSMethodSignature";
import { typescript } from "../configs";

// Valid test cases.
const valid: Array<string | RuleTester.ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }`,
    errors: [
      {
        messageId: "generic",
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
    errors: [
      {
        messageId: "generic",
        line: 2,
        column: 3
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, { valid, invalid });
});
