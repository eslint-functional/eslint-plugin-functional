/**
 * @fileoverview Tests for no-reject
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noReject";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [
    dedent`
      function bar(): Promise<number | Error> {
        if (Math.random() > 0.5) {
            return Promise.resolve(new Error("foo"))
        }
        return Promise.resolve(10)
      }`
  ],
  invalid: [
    {
      code: dedent`
        function foo(): Promise<number> {
          if (Math.random() > 0.5) {
              return Promise.reject(new Error("bar"))
          }
          return Promise.resolve(10)
        }`,
      errors: [
        {
          messageId: "generic",
          line: 3,
          column: 14
        }
      ]
    }
  ]
});
