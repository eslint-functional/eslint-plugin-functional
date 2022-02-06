import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      async function foo() {
        throw new Error();
      }
    `,
    optionsSet: [
      [
        {
          allowInAsyncFunctions: false,
        },
      ],
    ],
    errors: [
      {
        messageId: "generic",
        type: "ThrowStatement",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      async function foo() {
        function bar() {
          throw new Error();
        }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThrowStatement",
        line: 3,
        column: 5,
      },
    ],
  },
];

export default tests;
