import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x, y) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x, y) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = (x, y) => {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x, y) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
];

export default tests;
