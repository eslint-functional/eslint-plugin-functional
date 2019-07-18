/**
 * @fileoverview Tests for functional-parameter
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/functional-parameter";

import { es3, es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const es3Valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      var foo = {
        arguments: 2
      };
      foo.arguments = 3`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const es3Invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo(bar) {
        console.log(arguments);
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "arguments",
        type: "Identifier",
        line: 2,
        column: 15
      }
    ]
  }
];

// Valid test cases.
const es6Valid: ReadonlyArray<ValidTestCase> = [
  ...es3Valid,
  {
    code: dedent`
      function foo([bar, ...baz]) {
        console.log(bar, baz);
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }`,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ enforceParameterCount: "exactlyOne" }]
    ]
  },
  {
    code: dedent`
      function foo(bar, baz) {
        console.log(bar, baz);
      }`,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ ignorePattern: "^function foo", enforceParameterCount: "exactlyOne" }]
    ]
  },
  {
    code: dedent`
      function foo(...bar) {
        console.log(bar);
      }`,
    optionsSet: [[{ ignorePattern: "^function foo" }]]
  }
];

// Invalid test cases.
const es6Invalid: ReadonlyArray<InvalidTestCase> = [
  ...es3Invalid,
  {
    code: dedent`
      function foo(...bar) {
        console.log(bar);
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "restParam",
        type: "RestElement",
        line: 1,
        column: 14
      }
    ]
  },
  {
    code: dedent`
      function foo() {
        console.log("bar");
      }`,
    optionsSet: [[{ enforceParameterCount: "atLeastOne" }]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: "FunctionDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      function foo() {
        console.log("bar");
      }`,
    optionsSet: [[{ enforceParameterCount: "exactlyOne" }]],
    errors: [
      {
        messageId: "paramCountExactlyOne",
        type: "FunctionDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      function foo(bar, baz) {
        console.log(bar, baz);
      }`,
    optionsSet: [[{ enforceParameterCount: "exactlyOne" }]],
    errors: [
      {
        messageId: "paramCountExactlyOne",
        type: "FunctionDeclaration",
        line: 1,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(es3Valid),
    invalid: processInvalidTestCase(es3Invalid)
  });
});
