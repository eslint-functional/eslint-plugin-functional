import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-promise-reject";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

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
