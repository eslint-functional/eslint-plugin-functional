import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: `const foo = x => f(x);`,
    optionsSet: [[]],
  },
];

export default tests;
