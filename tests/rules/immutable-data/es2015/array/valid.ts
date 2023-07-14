import dedent from "dedent";

import { type rule } from "~/rules/immutable-data";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
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
      x ^= 1;
    `,
    optionsSet: [[]],
  },
];

export default tests;
