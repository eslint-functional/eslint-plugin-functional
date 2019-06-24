/**
 * @fileoverview Tests for no-delete
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noDelete";

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
        object.property = 1;
        delete object.property;`,
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
