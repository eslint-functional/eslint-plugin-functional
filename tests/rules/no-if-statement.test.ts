/**
 * @fileoverview Tests for no-if-statement
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noIfStatement";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
    {
      code: "if(i === 1) { x = 2; }",
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    }
  ]
});
