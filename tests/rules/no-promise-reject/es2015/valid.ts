import dedent from "dedent";

import type { rule } from "~/rules/no-promise-reject";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      function bar() {
        if (Math.random() > 0.5) {
            return Promise.resolve(new Error("foo"))
        }
        return Promise.resolve(10)
      }
    `,
    optionsSet: [[]],
  },
];

export default tests;
