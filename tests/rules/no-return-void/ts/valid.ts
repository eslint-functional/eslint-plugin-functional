import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function foo(bar) {
        return bar + 1;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  {
    code: dedent`
      function foo(bar: number): number {
        return bar + 1;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  // Not testing implicit return types, therefore this is valid.
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  // Allow null.
  {
    code: dedent`
      function foo(): null {
        return null;
      }`,
    optionsSet: [[], [{ allowNull: true }], [{ allowUndefined: false }]],
  },
  // Allow undefined.
  {
    code: dedent`
      function foo(): undefined {
        return undefined;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: true }]],
  },
];

export default tests;
