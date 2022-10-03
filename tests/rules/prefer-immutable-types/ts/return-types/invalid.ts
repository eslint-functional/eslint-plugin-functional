import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "function foo(): ReadonlySet<string> {}",
    optionsSet: [[{ returnTypes: "Immutable" }]],
    errors: [
      {
        messageId: "returnType",
        type: "TSTypeAnnotation",
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
        type: "TSTypeAnnotation",
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
        type: "Identifier",
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
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
    errors: [
      {
        messageId: "returnType",
        type: "TSTypeAnnotation",
        line: 1,
        column: 26,
      },
      {
        messageId: "returnType",
        type: "TSTypeAnnotation",
        line: 3,
        column: 27,
      },
      {
        messageId: "returnType",
        type: "Identifier",
        line: 4,
        column: 10,
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
        type: "TSTypeAnnotation",
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
        type: "TSTypeAnnotation",
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
        type: "TSTypeAnnotation",
        line: 2,
        column: 20,
      },
    ],
  },
];

export default tests;
