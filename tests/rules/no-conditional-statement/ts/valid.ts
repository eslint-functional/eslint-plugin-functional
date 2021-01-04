import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Exhaustive type test.
  {
    code: dedent`
      type T = "a" | "b";
      function foo(i: T) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
  },
];

export default tests;
