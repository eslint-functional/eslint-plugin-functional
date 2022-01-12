import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  // Don't allow mutable return type.
  {
    code: dedent`
      function foo(): Array<number> {}
      function bar(): number[] {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 17,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 17,
      },
    ],
  },
  {
    code: dedent`
      const foo = function(): Array<number> {}
      const bar = function(): number[] {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 25,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 25,
      },
    ],
  },
  {
    code: dedent`
      const foo = (): Array<number> => {}
      const bar = (): number[] => {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 17,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 17,
      },
    ],
  },
  {
    code: dedent`
      class Foo {
        foo(): Array<number> {}
      }
      class Bar {
        bar(): number[] {}
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 10,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 5,
        column: 10,
      },
    ],
  },
  // Interface with functions with mutable return types should fail.
  {
    code: dedent`
      interface Foo {
        a: () => string[],
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 12,
      },
    ],
  },
  // Type aliases with functions with mutable return types should fail.
  {
    code: dedent`
      type Foo = {
        a: () => string[],
      };
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 12,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments.
  {
    code: dedent`
      function foo(): Promise<Array<number>> {}
      function foo(): Promise<number[]> {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 17,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 17,
      },
    ],
  },
  // Don't allow mutable return type with deep Type Arguments.
  {
    code: dedent`
      type Foo<T> = { readonly x: T; };
      function foo(): Promise<Foo<Array<number>>> {}
      function bar(): Promise<Foo<number[]>> {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 17,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 17,
      },
    ],
  },
  // Don't allow mutable Type Arguments in a tuple return type.
  {
    code: dedent`
      function foo(): readonly [number, Array<number>, number] {}
      function bar(): readonly [number, number[], number] {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeOperator",
        line: 1,
        column: 17,
      },
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeOperator",
        line: 2,
        column: 17,
      },
    ],
  },
  // Don't allow mutable Union Type return type.
  {
    code: dedent`
      function foo(): { readonly a: Array<number> } | { readonly b: string[] } {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSUnionType",
        line: 1,
        column: 17,
      },
    ],
  },
  // Don't allow mutable Intersection Type return type.
  {
    code: dedent`
      function foo(): { readonly a: Array<number> } & { readonly b: string[] } {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSIntersectionType",
        line: 1,
        column: 17,
      },
    ],
  },
  // Don't allow mutable Conditional Type return type.
  {
    code: dedent`
      function foo<T>(): T extends Array<number> ? string : number[] {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSConditionalType",
        line: 1,
        column: 20,
      },
    ],
  },
  // Mutable method signature should fail.
  {
    code: dedent`
      type Foo = {
        a: () => {
          methodSignature(): string;
        },
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSTypeLiteral",
        line: 2,
        column: 12,
      },
    ],
  },
  {
    code: dedent`
      type Foo = {
        a: () => {
          methodSignature1(): string;
        } | {
          methodSignature2(): number;
        },
      };
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "returnTypeShouldBeReadonly",
        type: "TSUnionType",
        line: 2,
        column: 12,
      },
    ],
  },
];

export default tests;
