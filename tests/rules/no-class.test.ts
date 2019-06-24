/**
 * @fileoverview Tests for no-array-mutation
 */

import { name, rule } from "../../src/rules/noClass";
import { RuleTester, Rule } from "eslint";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 5 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
    {
      code: "class Foo {}",
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: "const klass = class {}",
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 15
        }
      ]
    }
  ]
});
