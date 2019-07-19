/**
 * @file Tests for no-class.
 */

import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-class";

import { es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: "class Foo {}",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ClassDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: "const klass = class {}",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ClassExpression",
        line: 1,
        column: 15
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
