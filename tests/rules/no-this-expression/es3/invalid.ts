import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: `this.x = 0;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThisExpression",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
