import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ValidTestCase[] = [
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x, y) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x, y) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = (x, y) => {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x, y) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
  // Optional parameters.
  {
    code: dedent`
      function f(x: number, y?: number) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      const a = ['1', '2'];
      a.map((x) => Number.parseInt(x));
    `,
    optionsSet: [[]],
  },
];

export default tests;
