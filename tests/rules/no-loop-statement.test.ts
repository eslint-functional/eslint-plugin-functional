/**
 * @fileoverview Tests for no-loop
 */

import { Rule, RuleTester } from "eslint";
import { name, rule } from "../../src/rules/noLoopStatement";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 }
});

// Run the tests.
ruleTester.run(name, rule as Rule.RuleModule, {
  valid: [],
  invalid: [
    {
      code: `for(const x = 0; x < 10; x++) { console.log(x); }`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `for(const x in y) { console.log(x); }`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `for(const x of y) { console.log(x); }`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `while(1 === 1) { console.log("a"); }`,
      errors: [
        {
          messageId: "generic",
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `do { console.log("a"); } while(1 === 1)`,
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
