import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: InvalidTestCase[] = [
  // Instantiation Expression
  {
    code: dedent`
      function f<T>(x: T): T {}
      const foo = x => f<number>(x);
    `,
    optionsSet: [[]],
    output: dedent`
      function f<T>(x: T): T {}
      const foo = f<number>;
    `,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      function foo(x) { return f<number>(x); }
    `,
    optionsSet: [[]],
    output: dedent`
      function f<T>(x: T): T {}
      const foo = f<number>;
    `,
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
