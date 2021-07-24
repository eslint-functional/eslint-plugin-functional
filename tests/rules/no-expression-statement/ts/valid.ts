import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Allowed ignoring void expressions.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");`,
    optionsSet: [[{ ignoreVoid: true }]],
  },
];

export default tests;
