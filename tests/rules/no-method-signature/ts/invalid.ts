import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo2 = {
        bar(a: number, b: string): number
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3,
      },
    ],
  },
];

export default tests;
