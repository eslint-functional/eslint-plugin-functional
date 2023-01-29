import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: InvalidTestCase[] = [
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x) {}
      const foo = x => f(x);
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
              function f(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f(x) {}
      function foo(x) { return f(x); }
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
              function f(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f(x) {}
      export default function (x) { return f(x); }
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
              function f(x) {}
              export default f
            `,
          },
        ],
      },
    ],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x) {}
      const foo = x => f(x);
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
              const f = function(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = x => {}
      const foo = x => f(x);
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
              const f = x => {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 3,
        column: 13,
        suggestions: [
          {
            output: dedent`
              type F = (x) => {};
              const f = undefined as unknown as F;
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
];

export default tests;
