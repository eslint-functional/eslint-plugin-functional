import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo() {
        if (Math.random() > 0.5) {
            return Promise.reject(new Error("bar"))
        }
        return Promise.resolve(10)
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "CallExpression",
        line: 3,
        column: 14,
      },
    ],
  },
];

export default tests;
