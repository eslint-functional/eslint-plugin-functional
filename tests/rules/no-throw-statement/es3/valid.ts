import dedent from "dedent";

import type { rule } from "#/rules/no-throw-statements";
import type { OptionsOf, ValidTestCaseSet } from "#/tests/helpers/util";

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
