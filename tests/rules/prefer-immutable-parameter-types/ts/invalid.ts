import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "function foo(arg: ReadonlySet<string>) {}",
    optionsSet: [[{ enforcement: "Immutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 1,
        column: 14,
      },
    ],
  },
  {
    code: "function foo(arg: ReadonlyMap<string, string>) {}",
    optionsSet: [[{ enforcement: "Immutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 1,
        column: 14,
      },
    ],
  },
  {
    code: "function foo(arg1: { foo: string }, arg2: { foo: number }) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 1,
        column: 14,
      },
      {
        messageId: "generic",
        type: "Identifier",
        line: 1,
        column: 37,
      },
    ],
  },
  {
    code: dedent`
      class Foo {
        constructor(
          private arg1: readonly string[],
          public arg2: readonly string[],
          protected arg3: readonly string[],
          readonly arg4: readonly string[],
        ) {}
      }
    `,
    optionsSet: [[{ enforcement: "Immutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 3,
        column: 13,
      },
      {
        messageId: "generic",
        type: "Identifier",
        line: 4,
        column: 12,
      },
      {
        messageId: "generic",
        type: "Identifier",
        line: 5,
        column: 15,
      },
      {
        messageId: "generic",
        type: "Identifier",
        line: 6,
        column: 14,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        (arg: readonly string[]): void;
      }
    `,
    optionsSet: [[{ enforcement: "Immutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 2,
        column: 4,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (arg: readonly string[]): void;
      }
    `,
    optionsSet: [[{ enforcement: "Immutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "Identifier",
        line: 2,
        column: 8,
      },
    ],
  },
];

export default tests;
