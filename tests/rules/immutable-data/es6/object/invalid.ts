import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      const x = {a: 1};
      x.a **= 1;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 2,
        column: 1,
      },
    ],
  },
  // No mutation in class methods.
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;

        constructor() {
          this.baz = "hello";
        }

        zoo() {
          this.bar = 2;
          this.baz = 3;
        }
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 10,
        column: 5,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 11,
        column: 5,
      },
    ],
  },
];

export default tests;
