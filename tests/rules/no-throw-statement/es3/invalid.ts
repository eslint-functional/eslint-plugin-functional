import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: `throw 'error';`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThrowStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `throw new Error();`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var error = new Error();
      throw error;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 2,
        column: 1,
      },
    ],
  },
];

export default tests;
