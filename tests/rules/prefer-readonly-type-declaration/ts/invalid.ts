import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo(...numbers: number[]) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: readonly number[]) {
      }
    `,
    errors: [
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 26,
      },
    ],
  },
  {
    code: dedent`
      function foo(...numbers: Array<number>) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>) {
      }
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 26,
      },
    ],
  },
  {
    code: dedent`
      function foo(numbers: Set<number>) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(numbers: ReadonlySet<number>) {
      }
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 23,
      },
    ],
  },
  {
    code: dedent`
      function foo(numbers: Map<number, string>) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(numbers: ReadonlyMap<number, string>) {
      }
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 23,
      },
    ],
  },
  // Should fail on Array type in interface.
  {
    code: dedent`
      interface Foo {
        readonly bar: Array<string>
      }
    `,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly bar: ReadonlyArray<string>
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 11,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 17,
      },
    ],
  },
  // Should fail on Array type in index interface.
  // https://github.com/typescript-eslint/typescript-eslint/issues/3714
  // {
  //   code: dedent`
  //     interface Foo {
  //       readonly [key: string]: {
  //         readonly groups: Array<string>
  //       }
  //     }`,
  //   optionsSet: [[]],
  //   output: dedent`
  //     interface Foo {
  //       readonly [key: string]: {
  //         readonly groups: ReadonlyArray<string>
  //       }
  //     }`,
  //   errors: [
  //     {
  //       messageId: "aliasShouldBeReadonly",
  //       type: "Identifier",
  //       line: 1,
  //       column: 11,
  //     },
  //     {
  //       messageId: "typeShouldBeReadonly",
  //       type: "TSTypeReference",
  //       line: 3,
  //       column: 22,
  //     },
  //   ],
  // },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      function foo(): Array<string> {
        interface Foo {
          readonly bar: Array<string>
        }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(): Array<string> {
        interface Foo {
          readonly bar: ReadonlyArray<string>
        }
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 13,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 19,
      },
    ],
  },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      const foo = (): Array<string> => {
        interface Foo {
          readonly bar: Array<string>
        }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      const foo = (): Array<string> => {
        interface Foo {
          readonly bar: ReadonlyArray<string>
        }
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 13,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 19,
      },
    ],
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: dedent`
      function foo(): number[] {
      }
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(): readonly number[] {
      }
    `,
    errors: [
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 17,
      },
    ],
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: `const foo = (): number[] => {}`,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: `const foo = (): readonly number[] => {}`,
    errors: [
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 17,
      },
    ],
  },
  // Should fail inside function.
  {
    code: dedent`
      const foo = function (): string {
        let bar: Array<string>;
      };
    `,
    optionsSet: [[]],
    output: dedent`
      const foo = function (): string {
        let bar: ReadonlyArray<string>;
      };
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 12,
      },
    ],
  },
  // Tuples.
  {
    code: dedent`
      function foo(tuple: [number, string]) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string]) {
      }
    `,
    errors: [
      {
        messageId: "tupleShouldBeReadonly",
        type: "TSTupleType",
        line: 1,
        column: 21,
      },
    ],
  },
  {
    code: dedent`
      function foo(tuple: [number, string, [number, string]]) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }
    `,
    errors: [
      {
        messageId: "tupleShouldBeReadonly",
        type: "TSTupleType",
        line: 1,
        column: 21,
      },
      {
        messageId: "tupleShouldBeReadonly",
        type: "TSTupleType",
        line: 1,
        column: 38,
      },
    ],
  },
  {
    code: dedent`
      function foo(tuple: readonly [number, string, [number, string]]) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }
    `,
    errors: [
      {
        messageId: "tupleShouldBeReadonly",
        type: "TSTupleType",
        line: 1,
        column: 47,
      },
    ],
  },
  {
    code: dedent`
      function foo(tuple: [number, string, readonly [number, string]]) {
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }
    `,
    errors: [
      {
        messageId: "tupleShouldBeReadonly",
        type: "TSTupleType",
        line: 1,
        column: 21,
      },
    ],
  },
  // Should fail on Array as type literal member as function parameter.
  {
    code: dedent`
      function foo(
        param1: {
          readonly bar: Array<string>,
          readonly baz: ReadonlyArray<string>
        }
      ): {
        readonly bar: Array<string>,
        readonly baz: ReadonlyArray<string>
      } {
        let foo: {
          readonly bar: Array<string>,
          readonly baz: ReadonlyArray<string>
        } = {
          bar: ["hello"],
          baz: ["world"]
        };
        return foo;
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo(
        param1: {
          readonly bar: ReadonlyArray<string>,
          readonly baz: ReadonlyArray<string>
        }
      ): {
        readonly bar: Array<string>,
        readonly baz: ReadonlyArray<string>
      } {
        let foo: {
          readonly bar: ReadonlyArray<string>,
          readonly baz: ReadonlyArray<string>
        } = {
          bar: ["hello"],
          baz: ["world"]
        };
        return foo;
      }
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 19,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 11,
        column: 19,
      },
    ],
  },
  // Should fail on Array type alias.
  {
    code: `type Foo = Array<string>;`,
    optionsSet: [[]],
    output: `type Foo = ReadonlyArray<string>;`,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 12,
      },
    ],
  },
  // Should fail on Array as type member.
  {
    code: dedent`
      function foo() {
        type Foo = {
          readonly bar: Array<string>
        }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          readonly bar: ReadonlyArray<string>
        }
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 8,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 19,
      },
    ],
  },
  // Should fail on Array type alias in local type.
  {
    code: dedent`
      function foo() {
        type Foo = Array<string>;
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = ReadonlyArray<string>;
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 8,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 14,
      },
    ],
  },
  // Should fail on Array as type member in local type.
  {
    code: dedent`
      function foo() {
        type Foo = {
          readonly bar: Array<string>
        }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          readonly bar: ReadonlyArray<string>
        }
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 8,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 3,
        column: 19,
      },
    ],
  },
  // Should fail on Array type in variable declaration.
  {
    code: `const foo: Array<string> = [];`,
    optionsSet: [[]],
    output: `const foo: ReadonlyArray<string> = [];`,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 12,
      },
    ],
  },
  // Should fail on shorthand Array syntax.
  {
    code: `const foo: number[] = [1, 2, 3];`,
    optionsSet: [[]],
    output: `const foo: readonly number[] = [1, 2, 3];`,
    errors: [
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 12,
      },
    ],
  },
  // Should fail on Array type being used as template param.
  {
    code: `let x: Foo<Array<string>>;`,
    optionsSet: [[]],
    output: `let x: Foo<ReadonlyArray<string>>;`,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 12,
      },
    ],
  },
  // Should fail on nested shorthand arrays.
  {
    code: `let x: readonly string[][];`,
    optionsSet: [[]],
    output: `let x: readonly (readonly string[])[];`,
    errors: [
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 17,
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
    output: dedent`
      class Klass {
        readonly foo: number;
        private readonly bar: number;
        static readonly baz: number;
        private static readonly qux: number;
      }
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "PropertyDefinition",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "PropertyDefinition",
        line: 3,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "PropertyDefinition",
        line: 4,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "PropertyDefinition",
        line: 5,
        column: 3,
      },
    ],
  },
  // Class Parameter Properties.
  {
    code: dedent`
      class Klass {
        constructor (
          public publicProp: string,
          protected protectedProp: string,
          private privateProp: string,
      ) { }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      class Klass {
        constructor (
          public readonly publicProp: string,
          protected readonly protectedProp: string,
          private readonly privateProp: string,
      ) { }
      }
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSParameterProperty",
        line: 3,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSParameterProperty",
        line: 4,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSParameterProperty",
        line: 5,
        column: 5,
      },
    ],
  },
  // Interface Index Signatures.
  {
    code: dedent`
      interface Foo {
        [key: string]: string
      }
      interface Bar {
        [key: string]: { prop: string }
      }
    `,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly [key: string]: string
      }
      interface Bar {
        readonly [key: string]: { prop: string }
      }
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 11,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 2,
        column: 3,
      },
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 4,
        column: 11,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 5,
        column: 3,
      },
    ],
  },
  // Function Index Signatures.
  {
    code: dedent`
      function bar(param: { [source: string]: string }): void {
        return undefined;
      }
    `,
    optionsSet: [[]],
    output: dedent`
      function bar(param: { readonly [source: string]: string }): void {
        return undefined;
      }
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 1,
        column: 23,
      },
    ],
  },
  // Type literal with indexer without readonly modifier should produce failures.
  {
    code: `let foo: { [key: string]: number };`,
    optionsSet: [[]],
    output: `let foo: { readonly [key: string]: number };`,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 1,
        column: 12,
      },
    ],
  },
  // Type literal in property template parameter without readonly should produce failures.
  {
    code: dedent`
      type foo = ReadonlyArray<{
        type: string,
        code: string,
      }>;
    `,
    optionsSet: [[]],
    output: dedent`
      type foo = ReadonlyArray<{
        readonly type: string,
        readonly code: string,
      }>;
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 3,
        column: 3,
      },
    ],
  },
  // Type literal without readonly on members should produce failures.
  // Also verify that nested members are checked.
  {
    code: dedent`
      let foo: {
        a: number,
        b: ReadonlyArray<string>,
        c: () => string,
        d: { readonly [key: string]: string },
        [key: string]: string,
        readonly e: {
          a: number,
          b: ReadonlyArray<string>,
          c: () => string,
          d: { readonly [key: string]: string },
          [key: string]: string,
        }
      };
    `,
    optionsSet: [[]],
    output: dedent`
      let foo: {
        readonly a: number,
        readonly b: ReadonlyArray<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string },
        readonly [key: string]: string,
        readonly e: {
          readonly a: number,
          readonly b: ReadonlyArray<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string },
          readonly [key: string]: string,
        }
      };
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 3,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 4,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 5,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 6,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 8,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 9,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 10,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 11,
        column: 5,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 12,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      function foo(bar: { x: number }) {
      };
    `,
    optionsSet: [[{ allowLocalMutation: true }]],
    output: dedent`
      function foo(bar: { readonly x: number }) {
      };
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 1,
        column: 21,
      },
    ],
  },
  // Mapped type without readonly.
  {
    code: dedent`
      const func = (x: { [key in string]: number }) => {}
    `,
    optionsSet: [[]],
    output: dedent`
      const func = (x: { readonly [key in string]: number }) => {}
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSMappedType",
        line: 1,
        column: 18,
      },
    ],
  },
  // Flag non class fields.
  {
    code: dedent`
      class Klass {
        foo() {
          let bar: {
            foo: number;
          };
        }
      }
    `,
    optionsSet: [[{ ignoreClass: "fieldsOnly" }]],
    output: dedent`
      class Klass {
        foo() {
          let bar: {
            readonly foo: number;
          };
        }
      }
    `,
    errors: [
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 4,
        column: 7,
      },
    ],
  },
  // Computed properties.
  {
    code: dedent`
      const propertyName = 'myProperty';
      type Foo = {
        [propertyName]: string;
      };
    `,
    optionsSet: [[]],
    output: dedent`
      const propertyName = 'myProperty';
      type Foo = {
        readonly [propertyName]: string;
      };
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 3,
        column: 3,
      },
    ],
  },
  // Don't allow mutable return type.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): Array<number> {}
      function bar(...numbers: readonly number[]): number[] {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>): ReadonlyArray<number> {}
      function bar(...numbers: readonly number[]): readonly number[] {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 50,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 46,
      },
    ],
  },
  // Don't allow mutable return type.
  {
    code: dedent`
      const foo = function(...numbers: ReadonlyArray<number>): Array<number> {}
      const bar = function(...numbers: readonly number[]): number[] {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      const foo = function(...numbers: ReadonlyArray<number>): ReadonlyArray<number> {}
      const bar = function(...numbers: readonly number[]): readonly number[] {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 58,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 54,
      },
    ],
  },
  // Don't allow mutable return type.
  {
    code: dedent`
      const foo = (...numbers: ReadonlyArray<number>): Array<number> => {}
      const bar = (...numbers: readonly number[]): number[] => {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      const foo = (...numbers: ReadonlyArray<number>): ReadonlyArray<number> => {}
      const bar = (...numbers: readonly number[]): readonly number[] => {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 50,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 46,
      },
    ],
  },
  // Don't allow mutable return type.
  {
    code: dedent`
      class Foo {
        foo(...numbers: ReadonlyArray<number>): Array<number> {
        }
      }
      class Bar {
        foo(...numbers: readonly number[]): number[] {
        }
      }
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      class Foo {
        foo(...numbers: ReadonlyArray<number>): ReadonlyArray<number> {
        }
      }
      class Bar {
        foo(...numbers: readonly number[]): readonly number[] {
        }
      }
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 43,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 6,
        column: 39,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): Promise<Array<number>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<number[]> {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>): Promise<ReadonlyArray<number>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<readonly number[]> {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 58,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 58,
      },
    ],
  },
  // Don't allow mutable return type with deep Type Arguments.
  {
    code: dedent`
      type Foo<T> = { readonly x: T; };
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<Array<number>>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<number[]>> {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      type Foo<T> = { readonly x: T; };
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<ReadonlyArray<number>>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<readonly number[]>> {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 62,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 3,
        column: 62,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments in a tuple.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): readonly [number, Array<number>, number] {}
      function foo(...numbers: ReadonlyArray<number>): readonly [number, number[], number] {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>): readonly [number, ReadonlyArray<number>, number] {}
      function foo(...numbers: ReadonlyArray<number>): readonly [number, readonly number[], number] {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 68,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 68,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments Union.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } | { readonly b: string[] } {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: ReadonlyArray<number> } | { readonly b: readonly string[] } {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 64,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 96,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments Intersection.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } & { readonly b: string[] } {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: ReadonlyArray<number> } & { readonly b: readonly string[] } {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 64,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 96,
      },
    ],
  },
  // Don't allow mutable return type with Type Arguments Conditional.
  {
    code: dedent`
      function foo<T>(x: T): T extends Array<number> ? string : number[] {}
    `,
    optionsSet: [[{ functionReturnTypes: "immutable" }]],
    output: dedent`
      function foo<T>(x: T): T extends ReadonlyArray<number> ? string : readonly number[] {}
    `,
    errors: [
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 34,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 59,
      },
    ],
  },
  // Readonly types should not be mutable.
  {
    code: dedent`
      type MyType = {
        a: string;
      };
    `,
    optionsSet: [[]],
    output: dedent`
      type MyType = {
        readonly a: string;
      };
    `,
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 2,
        column: 3,
      },
    ],
  },
  // Readonly type has mutable property.
  {
    code: dedent`
      type Foo = {
        mutableProp: string
      }
    `,
    optionsSet: [
      [
        {
          ignorePattern: "^mutable",
        },
      ],
    ],
    errors: [
      {
        messageId: "aliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Mutable types should not be readonly.
  {
    code: dedent`
      type MyType = {
        readonly a: string;
      };
    `,
    optionsSet: [
      [
        {
          readonlyAliasPatterns: "^I?Readonly.+$",
          mutableAliasPatterns: "^(?!I?Readonly).+$",
        },
      ],
    ],
    errors: [
      {
        messageId: "aliasShouldBeMutable",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Mutable types should not be readonly.
  {
    code: dedent`
      type MutableMyType = {
        readonly a: string;
      };
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "aliasShouldBeMutable",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Needs Explicit Marking.
  {
    code: dedent`
      type MyType = {};
    `,
    optionsSet: [
      [
        {
          readonlyAliasPatterns: "^I?Readonly.+$",
          mutableAliasPatterns: "^I?Mutable.+$",
        },
      ],
    ],
    errors: [
      {
        messageId: "aliasNeedsExplicitMarking",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Both Mutable and Readonly error.
  {
    code: dedent`
      type MyType = {};
    `,
    optionsSet: [
      [
        {
          readonlyAliasPatterns: ".+",
          mutableAliasPatterns: ".+",
        },
      ],
    ],
    errors: [
      {
        messageId: "aliasConfigErrorMutableReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
];

export default tests;
