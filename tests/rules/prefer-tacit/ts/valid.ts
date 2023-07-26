import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-tacit";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: "function foo(x) { f(x); }",
    optionsSet: [[]],
  },
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: "var foo = function(x) { f(x); }",
    optionsSet: [[]],
  },
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: `const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // Default parameters.
  {
    code: dedent`
      function f(x, y = 10) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
  },
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
  // Instantiation Expression
  {
    code: dedent`
      const foo = f<number>;
    `,
    dependencyConstraints: { typescript: "4.7.0" },
    optionsSet: [[]],
  },
];

export default tests;
