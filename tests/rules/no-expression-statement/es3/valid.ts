import dedent from "dedent";

import type { rule } from "~/rules/no-expression-statements";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Defining variable should still be allowed.
  {
    code: `var x = [];`,
    optionsSet: [[]],
  },
  // Allowed expressions should not cause failures.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");
    `,
    optionsSet: [[{ ignorePattern: "^console\\." }]],
  },
  // Allow specifying directive prologues.
  {
    code: `"use strict"`,
    optionsSet: [[]],
  },
];

export default tests;
