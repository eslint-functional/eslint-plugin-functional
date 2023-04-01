import dedent from "dedent";

import type { rule } from "~/rules/immutable-data";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;
        constructor() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[]],
  },
];

export default tests;
