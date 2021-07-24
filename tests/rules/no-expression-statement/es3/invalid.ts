import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      var x = [];
      x.push(1);`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
        line: 2,
        column: 1,
      },
    ],
  },
  // Non-allowed expressions should cause failures.
  {
    code: `console.trace();`,
    optionsSet: [[{ ignorePattern: "^console\\.log" }]],
    errors: [
      {
        messageId: "generic",
        type: "ExpressionStatement",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
