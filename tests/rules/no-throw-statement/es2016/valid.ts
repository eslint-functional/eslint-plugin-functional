import dedent from "dedent";

import { type rule } from "~/rules/no-throw-statements";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

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
