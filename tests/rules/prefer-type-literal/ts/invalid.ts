import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {}`,
    optionsSet: [[]],
    output: dedent`
      type Foo = {};`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = Bar & {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Baz {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = Bar & Baz & {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
