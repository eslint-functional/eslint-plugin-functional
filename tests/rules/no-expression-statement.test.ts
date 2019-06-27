/**
 * @fileoverview Tests for no-expression-statement
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noExpressionStatement";

import { es3, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  // Defining variable should still be allowed.
  {
    code: `var x = [];`,
    optionsSet: [[]]
  },
  // Ignored expressions should not cause failures.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");`,
    optionsSet: [
      [{ ignorePrefix: ["console.log", "console.err"] }],
      [{ ignoreSuffix: ["og", "ror"] }],
      [{ ignorePattern: "console.*" }]
    ]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      var x = [];
      x.push(1);`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
        line: 2,
        column: 1
      }
    ]
  },
  // Unignored expressions should cause failures.
  {
    code: `console.trace();`,
    optionsSet: [
      [{ ignorePrefix: ["console.log", "console.err"] }],
      [{ ignoreSuffix: ["og", "ror"] }]
    ],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
        line: 1,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
