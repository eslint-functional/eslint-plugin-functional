import dedent from "dedent";

import type { rule } from "~/rules/no-expression-statements";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Allowed ignoring void expressions.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");
    `,
    optionsSet: [[{ ignoreVoid: true }]],
  },
];

export default tests;
