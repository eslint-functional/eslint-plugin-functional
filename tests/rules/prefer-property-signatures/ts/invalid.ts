import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }
    `,
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
      }
    `,
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
      type Foo = Bar & Readonly<Baz> & {
        methodSignature(): void
      }
    `,
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
      type Foo = Bar & Readonly<Baz & {
        nested: {
          methodSignature(): void
        }
      }>
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 3,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: Readonly<{
          deepNested: {
            methodSignature(): void
          }
        }>
      }>{}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 4,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: {
          deepNested: Readonly<{
            methodSignature(): void
          }>
        }
      }>{}
    `,
    optionsSet: [[{ ignoreIfReadonly: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 4,
        column: 7,
      },
    ],
  },
];

export default tests;
