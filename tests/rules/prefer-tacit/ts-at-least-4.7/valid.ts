import dedent from "dedent";

import type { rule } from "~/rules/prefer-tacit";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Instantiation Expression
  {
    code: dedent`
      const foo = f<number>;
    `,
    optionsSet: [[]],
  },
];

export default tests;
