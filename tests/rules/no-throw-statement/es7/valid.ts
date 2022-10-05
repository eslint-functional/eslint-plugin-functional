import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ValidTestCase[] = [
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
