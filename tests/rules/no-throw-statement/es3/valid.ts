import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-throw-statements";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      function foo() {
        console.error("boop");
      }
    `,
    optionsSet: [[]],
  },
];

export default tests;
