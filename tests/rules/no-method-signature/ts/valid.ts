import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar: (a: number, b: string) => number;
      }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo2 = {
        bar: (a: number, b: string) => number
      }`,
    optionsSet: [[]],
  },
];

export default tests;
