import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-throw-statements";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      async function foo() {
        throw new Error();
      }
    `,
    optionsSet: [
      [
        {
          allowInAsyncFunctions: true,
        },
      ],
    ],
  },
];

export default tests;
