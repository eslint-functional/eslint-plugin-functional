import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "const foo: ReadonlySet<string> = {} as any",
    optionsSet: [[{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: "Identifier",
        line: 1,
        column: 7,
      },
    ],
  },
  {
    code: "const foo: ReadonlyMap<string, string> = {} as any",
    optionsSet: [[{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: "Identifier",
        line: 1,
        column: 7,
      },
    ],
  },
  {
    code: "const foo = { foo: 'bar' };",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
    errors: [
      {
        messageId: "variable",
        type: "Identifier",
        line: 1,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      const foo: Readonly<{ foo: string }> = {} as any,
            bar: { foo: number } = {} as any;
    `,
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
    errors: [
      {
        messageId: "variable",
        type: "Identifier",
        line: 2,
        column: 7,
      },
    ],
  },
  // Local.
  {
    code: dedent`
      function foo() {
        let foo: {
          a: { foo: number },
          b: string[],
          c: () => string[],
          d: { [key: string]: string[] },
          [key: string]: any,
        }
      };
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "variable",
        type: "Identifier",
        line: 2,
        column: 7,
      },
      {
        messageId: "returnType",
        type: "TSTypeAnnotation",
        line: 5,
        column: 11,
      },
    ],
  },
  // Class Property Signatures.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }
    `,
    optionsSet: [[]],
    // output: dedent`
    //   class Klass {
    //     readonly foo: number;
    //     private readonly bar: number;
    //     static readonly baz: number;
    //     private static readonly qux: number;
    //   }
    // `,
    errors: [
      {
        messageId: "propertyModifier",
        type: "PropertyDefinition",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyModifier",
        type: "PropertyDefinition",
        line: 3,
        column: 3,
      },
      {
        messageId: "propertyModifier",
        type: "PropertyDefinition",
        line: 4,
        column: 3,
      },
      {
        messageId: "propertyModifier",
        type: "PropertyDefinition",
        line: 5,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      class Klass {
        readonly foo: { foo: number };
        private readonly bar: { foo: number };
        static readonly baz: { foo: number };
        private static readonly qux: { foo: number };
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "propertyImmutability",
        type: "PropertyDefinition",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: "PropertyDefinition",
        line: 3,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: "PropertyDefinition",
        line: 4,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: "PropertyDefinition",
        line: 5,
        column: 3,
      },
    ],
  },
];

export default tests;
