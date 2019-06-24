/**
 * @fileoverview Tests for no-throw
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noThrow";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
    {
      code: `throw 'error';`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `throw new Error();`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: dedent`
        const error = new Error();
        throw error;`,
      errors: [
        {
          messageId: "generic",
          line: 2,
          column: 1
        }
      ]
    }
  ]
});
