import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ValidTestCase[] = [
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        constructor() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[]],
  },
  // IgnoreAccessorPattern - classes.
  {
    code: dedent`
      class Klass {
        mutate() {
          this.mutableField = 0;
        }
      }
    `,
    optionsSet: [
      [{ ignoreAccessorPattern: ["this.*.**"] }],
      [{ ignoreAccessorPattern: ["**.mutable*"] }],
      [{ ignoreAccessorPattern: ["**.mutable*.**"] }],
    ],
  },
  // Ignore class
  {
    code: dedent`
      class Klass {
        mutate() {
          this.baz = "hello";
        }
      }
    `,
    optionsSet: [[{ ignoreClasses: true }], [{ ignoreClasses: "fieldsOnly" }]],
  },
];

export default tests;
