import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ValidTestCase[] = [
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
