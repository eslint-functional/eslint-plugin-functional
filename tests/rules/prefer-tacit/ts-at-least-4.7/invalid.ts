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
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
        suggestions: [
          {
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
      },
    ],
  },
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
        suggestions: [
          {
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      export default function (x) { return f<number>(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "FunctionDeclaration",
        line: 2,
        column: 16,
        suggestions: [
          {
            output: dedent`
              function f<T>(x: T): T {}
              export default f<number>
            `,
          },
        ],
      },
    ],
  },
];

export default tests;
