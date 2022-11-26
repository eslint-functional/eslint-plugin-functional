import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: InvalidTestCase[] = [
  {
    code: dedent`
      type Foo = Readonly<{
        bar: string;
      }>;
    `,
    optionsSet: [["keyword"]],
    output: dedent`
      type Foo = {
        readonly bar: string;
      };
    `,
    errors: [
      {
        messageId: "keyword",
        type: "Identifier",
        line: 1,
        column: 12,
      },
    ],
  },
  {
    code: dedent`
      type Foo = {
        readonly bar: string;
      };
    `,
    optionsSet: [["generic"]],
    output: dedent`
      type Foo = Readonly<{
        bar: string;
      }>;
    `,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeLiteral",
        line: 1,
        column: 12,
      },
    ],
  },
];

export default tests;
