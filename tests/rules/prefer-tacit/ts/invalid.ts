import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      function f(x) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      const f = function(x) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = x => {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      const f = x => {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 3,
        column: 13,
      },
    ],
  },
  // Optional parameters.
  {
    code: dedent`
      function f(x: number, y?: number) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      function f(x: number, y?: number) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
];

export default tests;
