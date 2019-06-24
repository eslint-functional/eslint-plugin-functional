/**
 * @fileoverview Tests for no-method-signature
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noTSMethodSignature";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
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
  ]
});
