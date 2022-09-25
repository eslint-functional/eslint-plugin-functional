import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      (() => {
        console.log("hello world");
      })();
    `,
    optionsSet: [[{ enforceParameterCount: { ignoreIIFE: false } }]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: "ArrowFunctionExpression",
        line: 1,
        column: 2,
      },
    ],
  },
  {
    code: dedent`
      function foo(...bar) {
        console.log(bar);
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "restParam",
        type: "RestElement",
        line: 1,
        column: 14,
      },
    ],
  },
  {
    code: dedent`
      const obj = {
        foo(...params) {
          console.log(params);
        },
        bar(...params) {
          console.log(params);
        },
      }
    `,
    optionsSet: [[{ ignorePattern: "^foo" }]],
    errors: [
      {
        messageId: "restParam",
        type: "RestElement",
        line: 5,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      function foo(param) {}
      foo(() => 1);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 5,
      },
    ],
  },
];

export default tests;
