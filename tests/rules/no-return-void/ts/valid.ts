import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-return-void";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      function foo(bar) {
        return bar + 1;
      }
    `,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  {
    code: dedent`
      function foo(bar: number): number {
        return bar + 1;
      }
    `,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  // Ignore implicit return types.
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }
    `,
    optionsSet: [
      [{ ignoreInferredTypes: true }],
      [{ ignoreInferredTypes: true, allowNull: false }],
      [{ ignoreInferredTypes: true, allowUndefined: false }],
    ],
  },
  // Allow null.
  {
    code: dedent`
      function foo(): null {
        return null;
      }
    `,
    optionsSet: [[], [{ allowNull: true }], [{ allowUndefined: false }]],
  },
  // Allow undefined.
  {
    code: dedent`
      function foo(): undefined {
        return undefined;
      }
    `,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: true }]],
  },
];

export default tests;
