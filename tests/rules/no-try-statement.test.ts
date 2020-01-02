/**
 * @file Tests for no-try-statement.
 */

import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-try-statement";

import { es3, typescript } from "../helpers/configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  tsInstalled,
  ValidTestCase
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]]
  },
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[{ allowCatch: true }]]
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[{ allowFinally: true }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowCatch: true }]],
    errors: [
      {
        messageId: "finally",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowFinally: true }]],
    errors: [
      {
        messageId: "catch",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "finally",
        type: "TryStatement",
        line: 1,
        column: 1
      }
    ]
  }
];

if (tsInstalled()) {
  describe("TypeScript", () => {
    const ruleTester = new RuleTester(typescript);
    ruleTester.run(name, rule, {
      valid: processValidTestCase(valid),
      invalid: processInvalidTestCase(invalid)
    });
  });
}

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
