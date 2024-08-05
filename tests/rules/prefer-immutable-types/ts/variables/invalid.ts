import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import type { rule } from "#/rules/prefer-immutable-types";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: "const foo: ReadonlySet<string> = {} as any",
    optionsSet: [[{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: AST_NODE_TYPES.Identifier,
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
        type: AST_NODE_TYPES.Identifier,
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
        type: AST_NODE_TYPES.Identifier,
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
    optionsSet: [[{ variables: "ReadonlyShallow" }]],
    errors: [
      {
        messageId: "variable",
        type: AST_NODE_TYPES.Identifier,
        line: 2,
        column: 7,
        suggestions: [
          {
            messageId: "userDefined",
            data: {
              message: "Surround with Readonly.",
            },
            output: dedent`
              const foo: Readonly<{ foo: string }> = {} as any,
                    bar: Readonly<{ foo: number }> = {} as any;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      const foo: Readonly<{ foo: string }> = {} as any,
            bar: { foo: number } = {} as any;
    `,
    optionsSet: [[{ variables: "ReadonlyDeep" }], [{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: AST_NODE_TYPES.Identifier,
        line: 2,
        column: 7,
      },
    ],
  },
  // Destructuring array.
  {
    code: dedent`
      const [a, ...rest] = [1, 2];
    `,
    optionsSet: [[{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: AST_NODE_TYPES.RestElement,
        line: 1,
        column: 11,
      },
    ],
  },
  // Destructuring object.
  {
    code: dedent`
      const { a, ...rest } = { a: 1, b: 2 };
    `,
    optionsSet: [[{ variables: "Immutable" }]],
    errors: [
      {
        messageId: "variable",
        type: AST_NODE_TYPES.RestElement,
        line: 1,
        column: 12,
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
        type: AST_NODE_TYPES.Identifier,
        line: 2,
        column: 7,
      },
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
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
    errors: [
      {
        messageId: "propertyModifier",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 2,
        column: 3,
        suggestions: [
          {
            messageId: "propertyModifierSuggestion",
            output: dedent`
              class Klass {
                readonly foo: number;
                private bar: number;
                static baz: number;
                private static qux: number;
              }
            `,
          },
        ],
      },
      {
        messageId: "propertyModifier",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 3,
        column: 3,
        suggestions: [
          {
            messageId: "propertyModifierSuggestion",
            output: dedent`
              class Klass {
                foo: number;
                private readonly bar: number;
                static baz: number;
                private static qux: number;
              }
            `,
          },
        ],
      },
      {
        messageId: "propertyModifier",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 4,
        column: 3,
        suggestions: [
          {
            messageId: "propertyModifierSuggestion",
            output: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static readonly baz: number;
                private static qux: number;
              }
            `,
          },
        ],
      },
      {
        messageId: "propertyModifier",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 5,
        column: 3,
        suggestions: [
          {
            messageId: "propertyModifierSuggestion",
            output: dedent`
              class Klass {
                foo: number;
                private bar: number;
                static baz: number;
                private static readonly qux: number;
              }
            `,
          },
        ],
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
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 3,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 4,
        column: 3,
      },
      {
        messageId: "propertyImmutability",
        type: AST_NODE_TYPES.PropertyDefinition,
        line: 5,
        column: 3,
      },
    ],
  },
];

export default tests;
