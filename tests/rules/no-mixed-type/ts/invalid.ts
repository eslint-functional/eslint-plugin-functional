import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  // Mixing properties and methods (MethodSignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo(): number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAliasDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: () => number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAliasDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
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
