import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Allow initialization of class members in constructor
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;
        constructor() {
          this.baz = "hello";
        }
      }`,
    optionsSet: [[]],
  },
  // IgnoreAccessorPattern - classes.
  {
    code: dedent`
      class Klass {
        mutate() {
          this.mutableField = 0;
        }
      }`,
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
        baz: string;
        mutate() {
          this.baz = "hello";
        }
      }`,
    optionsSet: [[{ ignoreClass: true }], [{ ignoreClass: "fieldsOnly" }]],
  },
];

export default tests;
