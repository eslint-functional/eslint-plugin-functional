import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      (() => {
        console.log("hello world");
      })();`,
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
      }`,
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
];

export default tests;
