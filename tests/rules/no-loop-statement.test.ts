/**
 * @fileoverview Tests for no-loop
 */

import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noLoopStatement";

import { es3, es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  {
    code: `for (const x = 0; x < 10; x++) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ForStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (const x in y) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ForInStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (const x of y) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ForOfStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `while (true) { console.log("a"); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "WhileStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `do { console.log("a"); } while (true)`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "DoWhileStatement",
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

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase([]),
    invalid: processInvalidTestCase([
      {
        code: `for (var x = 0; x < 10; x++) { console.log(x); }`,
        optionsSet: [[]],
        errors: [
          {
            messageId: "generic",
            type: "ForStatement",
            line: 1,
            column: 1
          }
        ]
      },
      {
        code: `for (var x in y) { console.log(x); }`,
        optionsSet: [[]],
        errors: [
          {
            messageId: "generic",
            type: "ForInStatement",
            line: 1,
            column: 1
          }
        ]
      },
      {
        code: `while (true) { console.log("a"); }`,
        optionsSet: [[]],
        errors: [
          {
            messageId: "generic",
            type: "WhileStatement",
            line: 1,
            column: 1
          }
        ]
      },
      {
        code: `do { console.log("a"); } while (true)`,
        optionsSet: [[]],
        errors: [
          {
            messageId: "generic",
            type: "DoWhileStatement",
            line: 1,
            column: 1
          }
        ]
      }
    ])
  });
});
