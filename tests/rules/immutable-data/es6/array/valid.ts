import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      const x = 0;
      x *= 1;
      x **= 1;
      x /= 1;
      x %= 1;
      x <<= 1;
      x >>= 1;
      x >>>= 1;
      x &= 1;
      x |= 1;
      x ^= 1;`,
    optionsSet: [[]],
  },
];

export default tests;
