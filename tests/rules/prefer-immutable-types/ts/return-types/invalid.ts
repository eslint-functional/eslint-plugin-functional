import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-immutable-types";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: "function foo(): ReadonlySet<string> {}",
    optionsSet: [[{ returnTypes: "Immutable" }]],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 15,
      },
    ],
  },
  {
    code: "function foo(): ReadonlyMap<string, string> {}",
    optionsSet: [[{ returnTypes: "Immutable" }]],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 15,
      },
    ],
  },
  {
    code: "function foo() { return { foo: 'bar' }; }",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.Identifier,
        line: 1,
        column: 10,
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: number): { foo: string };
      function foo(arg: string): Readonly<{ foo: number }>;
      function foo(arg: unknown): { foo: number };
      function foo(arg: unknown) {}
    `,
    optionsSet: [[{ returnTypes: "ReadonlyShallow" }]],

    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
        suggestions: [
          {
            messageId: "returnType",
            output: dedent`
              function foo(arg: number): Readonly<{ foo: string }>;
              function foo(arg: string): Readonly<{ foo: number }>;
              function foo(arg: unknown): { foo: number };
              function foo(arg: unknown) {}
            `,
          },
        ],
      },
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 3,
        column: 27,
        suggestions: [
          {
            messageId: "returnType",
            output: dedent`
              function foo(arg: number): { foo: string };
              function foo(arg: string): Readonly<{ foo: number }>;
              function foo(arg: unknown): Readonly<{ foo: number }>;
              function foo(arg: unknown) {}
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: number): { foo: string };
      function foo(arg: string): Readonly<{ foo: number }>;
      function foo(arg: unknown): { foo: number };
      function foo(arg: unknown) {}
    `,
    optionsSet: [
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
      },
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 3,
        column: 27,
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: number): { foo: string };
      function foo(arg: string): Readonly<{ foo: number }>;
      function foo(arg: number | string) {}
    `,
    optionsSet: [
      [
        {
          returnTypes: { enforcement: "Immutable", ignoreInferredTypes: true },
        },
      ],
    ],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        (arg: string): readonly string[];
      }
    `,
    optionsSet: [[{ returnTypes: "Immutable" }]],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 2,
        column: 16,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (arg: string): readonly string[];
      }
    `,
    optionsSet: [[{ returnTypes: "Immutable" }]],
    errors: [
      {
        messageId: "returnType",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 2,
        column: 20,
      },
    ],
  },
];

export default tests;
