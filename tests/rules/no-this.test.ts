/**
 * @fileoverview Tests for no-this
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noThis";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [`let x = 0;`],
  invalid: [
    {
      code: `this.x = 0;`,
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
