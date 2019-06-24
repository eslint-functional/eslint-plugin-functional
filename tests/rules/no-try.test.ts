/**
 * @fileoverview Tests for no-try
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noTry";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [`let x = 0;`],
  invalid: [
    {
      code: `try {} catch (e) {}`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `try {} catch (e) {} finally {}`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `try {} finally {}`,
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
