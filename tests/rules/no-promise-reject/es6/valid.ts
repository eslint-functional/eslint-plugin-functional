import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function bar() {
        if (Math.random() > 0.5) {
            return Promise.resolve(new Error("foo"))
        }
        return Promise.resolve(10)
      }`,
    optionsSet: [[]],
  },
];

export default tests;
