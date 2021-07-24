import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo() {
        console.log("hello world");
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: "FunctionDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      (function() {
        console.log("hello world");
      })();`,
    optionsSet: [[{ enforceParameterCount: { ignoreIIFE: false } }]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: "FunctionExpression",
        line: 1,
        column: 2,
      },
    ],
  },
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
        column: 15,
      },
    ],
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
        column: 1,
      },
    ],
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
        column: 1,
      },
    ],
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
        column: 1,
      },
    ],
  },
];

export default tests;
