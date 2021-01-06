import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: `for (var x = 0; x < 10; x++) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ForStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `for (var x in y) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ForInStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `while (true) { console.log("a"); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "WhileStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `do { console.log("a"); } while (true)`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "DoWhileStatement",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
