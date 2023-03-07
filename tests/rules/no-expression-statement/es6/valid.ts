import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ValidTestCase[] = [
  // Allow yield.
  {
    code: dedent`
      export function* foo() {
        yield "hello";
        return "world";
      }
    `,
    optionsSet: [[]],
  },
];

export default tests;
