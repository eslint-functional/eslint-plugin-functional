import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  // Instantiation Expression not supported.
  {
    code: dedent`
      function f<T>(x: T): T {}
      function foo(x) { return f<number>(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "FunctionDeclaration",
        line: 2,
        column: 1,
      },
    ],
  },
];

export default tests;
