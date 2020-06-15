/**
 * @file Tests for prefer-readonly-type.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/prefer-readonly-type";

import { typescript } from "../helpers/configs";
import {
  describeTsOnly,
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  // Should not fail on explicit ReadonlyArray parameter.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>) {
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      function foo(...numbers: readonly number[]) {
      }`,
    optionsSet: [[]]
  },
  // Should not fail on explicit ReadonlyArray return type.
  {
    code: dedent`
      function foo(): ReadonlyArray<number> {
        return [1, 2, 3];
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      const foo = (): ReadonlyArray<number> => {
        return [1, 2, 3];
      }`,
    optionsSet: [[]]
  },
  // ReadonlyArray Tuple.
  {
    code: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray type alias.
  {
    code: `type Foo = ReadonlyArray<string>;`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray type alias in local type.
  {
    code: dedent`
      function foo() {
        type Foo = ReadonlyArray<string>;
      }`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray in variable declaration.
  {
    code: `const foo: ReadonlyArray<string> = [];`,
    optionsSet: [[]]
  },
  // Allow return type.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): Array<number> {}
      function bar(...numbers: readonly number[]): number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type.
  {
    code: dedent`
      const foo = function(...numbers: ReadonlyArray<number>): Array<number> {}
      const bar = function(...numbers: readonly number[]): number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type.
  {
    code: dedent`
      const foo = (...numbers: ReadonlyArray<number>): Array<number> =>  {}
      const bar = (...numbers: readonly number[]): number[] =>  {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type.
  {
    code: dedent`
      class Foo {
        foo(...numbers: ReadonlyArray<number>): Array<number> {
        }
      }
      class Bar {
        foo(...numbers: readonly number[]): number[] {
        }
      }`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with Type Arguments.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): Promise<Array<number>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<number[]> {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with deep Type Arguments.
  {
    code: dedent`
      type Foo<T> = { readonly x: T; };
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<Array<number>>> {}
      function foo(...numbers: ReadonlyArray<number>): Promise<Foo<number[]>> {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with Type Arguments in a tuple.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): readonly [number, Array<number>, number] {}
      function foo(...numbers: ReadonlyArray<number>): readonly [number, number[], number] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with Type Arguments Union.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } | { readonly b: string[] } {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with Type Arguments Intersection.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } & { readonly b: string[] } {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Allow return type with Type Arguments Conditional.
  {
    code: dedent`
      function foo<T>(x: T): T extends Array<number> ? string : number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]]
  },
  // Should not fail on implicit ReadonlyArray type in variable declaration.
  {
    code: dedent`
      const foo = [1, 2, 3] as const`,
    optionsSet: [[{ checkImplicit: true }]]
  },
  // Should not fail on implicit Array.
  {
    code: dedent`
      const foo = [1, 2, 3]
      function bar(param = [1, 2, 3]) {}`,
    optionsSet: [[]]
  },
  // Interface with readonly modifiers should not produce failures.
  {
    code: dedent`
      interface Foo {
        readonly a: number,
        readonly b: ReadonlyArray<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string },
        readonly [key: string]: string,
      }`,
    optionsSet: [[]]
  },
  // PropertySignature and IndexSignature members without readonly modifier
  // should produce failures. Also verify that nested members are checked.
  {
    code: dedent`
      interface Foo {
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
      }`,
    optionsSet: [[]]
  },
  // Class with parameter properties.
  {
    code: dedent`
      class Klass {
        constructor (
          nonParameterProp: string,
          readonly readonlyProp: string,
          public readonly publicReadonlyProp: string,
          protected readonly protectedReadonlyProp: string,
          private readonly privateReadonlyProp: string,
      ) { }
    }`,
    optionsSet: [[]]
  },
  // CallSignature and MethodSignature cannot have readonly modifiers and should
  // not produce failures.
  {
    code: dedent`
      interface Foo {
        (): void
        foo(): void
      }`,
    optionsSet: [[]]
  },
  // The literal with indexer with readonly modifier should not produce failures.
  {
    code: `let foo: { readonly [key: string]: number };`,
    optionsSet: [[]]
  },
  // Type literal in array template parameter with readonly should not produce failures.
  {
    code: `type foo = ReadonlyArray<{ readonly type: string, readonly code: string }>;`,
    optionsSet: [[]]
  },
  // Type literal with readonly on members should not produce failures.
  {
    code: dedent`
      let foo: {
        readonly a: number,
        readonly b: ReadonlyArray<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string }
        readonly [key: string]: string
      };`,
    optionsSet: [[]]
  },
  // Mapped types with readonly on members should not produce failures.
  {
    code: dedent`
      const func = (x: { readonly [key in string]: number }) => {}`,
    optionsSet: [[]]
  },
  // Ignore Classes.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }`,
    optionsSet: [[{ ignoreClass: true }]]
  },
  // Ignore Interfaces.
  {
    code: dedent`
      interface Foo {
        foo: number,
        bar: ReadonlyArray<string>,
        baz: () => string,
        qux: { [key: string]: string }
      }`,
    optionsSet: [[{ ignoreInterface: true }]]
  },
  // Allow Local.
  {
    code: dedent`
      function foo() {
        let foo: {
          a: number,
          b: ReadonlyArray<string>,
          c: () => string,
          d: { [key: string]: string },
          [key: string]: string,
          readonly d: {
            a: number,
            b: ReadonlyArray<string>,
            c: () => string,
            d: { [key: string]: string },
            [key: string]: string,
          }
        }
      };`,
    optionsSet: [[{ allowLocalMutation: true }]]
  },
  // Ignore Prefix.
  {
    code: dedent`
      let mutableFoo: string[] = [];`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      let foo: {
        mutableA: number,
        mutableB: ReadonlyArray<string>,
        mutableC: () => string,
        mutableD: { readonly [key: string]: string },
        mutableE: {
          mutableA: number,
          mutableB: ReadonlyArray<string>,
          mutableC: () => string,
          mutableD: { readonly [key: string]: string },
        }
      };`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      class Klass {
        mutableA: string;
        private mutableB: string;
      }`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  // Ignore Suffix.
  {
    code: dedent`
      let fooMutable: string[] = [];`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      let foo: {
        aMutable: number,
        bMutable: ReadonlyArray<string>,
        cMutable: () => string,
        dMutable: { readonly [key: string]: string },
        eMutable: {
          aMutable: number,
          bMutable: ReadonlyArray<string>,
          cMutable: () => string,
          dMutable: { readonly [key: string]: string },
        }
      };`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      class Klass {
        AMutable: string;
        private BMutable: string;
      }`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  // Allow mutable TSIndexSignature.
  {
    code: dedent`
      const mutableResult: {
        [key: string]: string
      } = {};`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      function foo(...numbers: number[]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: readonly number[]) {
      }`,
    errors: [
      {
        messageId: "array",
        type: "TSArrayType",
        line: 1,
        column: 26
      }
    ]
  },
  {
    code: dedent`
      function foo(...numbers: Array<number>) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>) {
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 26
      }
    ]
  },
  {
    code: dedent`
      function foo(numbers: Set<number>) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(numbers: ReadonlySet<number>) {
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 23
      }
    ]
  },
  {
    code: dedent`
      function foo(numbers: Map<number, string>) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(numbers: ReadonlyMap<number, string>) {
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 23
      }
    ]
  },
  // Should fail on Array type in interface.
  {
    code: dedent`
      interface Foo {
        readonly bar: Array<string>
      }`,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly bar: ReadonlyArray<string>
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 2,
        column: 17
      }
    ]
  },
  // Should fail on Array type in index interface.
  {
    code: dedent`
      interface Foo {
        readonly [key: string]: {
          readonly groups: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly [key: string]: {
          readonly groups: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 22
      }
    ]
  },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      function foo(): Array<string> {
        interface Foo {
          readonly bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): ReadonlyArray<string> {
        interface Foo {
          readonly bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 17
      },
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 19
      }
    ]
  },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      const foo = (): Array<string> => {
        interface Foo {
          readonly bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      const foo = (): ReadonlyArray<string> => {
        interface Foo {
          readonly bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 17
      },
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 19
      }
    ]
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: dedent`
      function foo(): number[] {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): readonly number[] {
      }`,
    errors: [
      {
        messageId: "array",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: `const foo = (): number[] => {}`,
    optionsSet: [[]],
    output: `const foo = (): readonly number[] => {}`,
    errors: [
      {
        messageId: "array",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  },
  // Should fail inside function.
  {
    code: dedent`
      const foo = function (): string {
        let bar: Array<string>;
      };`,
    optionsSet: [[]],
    output: dedent`
      const foo = function (): string {
        let bar: ReadonlyArray<string>;
      };`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 2,
        column: 12
      }
    ]
  },
  // Tuples.
  {
    code: dedent`
      function foo(tuple: [number, string]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string]) {
      }`,
    errors: [
      {
        messageId: "tuple",
        type: "TSTupleType",
        line: 1,
        column: 21
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: [number, string, [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "tuple",
        type: "TSTupleType",
        line: 1,
        column: 21
      },
      {
        messageId: "tuple",
        type: "TSTupleType",
        line: 1,
        column: 38
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: readonly [number, string, [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "tuple",
        type: "TSTupleType",
        line: 1,
        column: 47
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: [number, string, readonly [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "tuple",
        type: "TSTupleType",
        line: 1,
        column: 21
      }
    ]
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
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(
        param1: {
          readonly bar: ReadonlyArray<string>,
          readonly baz: ReadonlyArray<string>
        }
      ): {
        readonly bar: ReadonlyArray<string>,
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
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 19
      },
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 7,
        column: 17
      },
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 11,
        column: 19
      }
    ]
  },
  // Should fail on Array type alias.
  {
    code: `type Foo = Array<string>;`,
    optionsSet: [[]],
    output: `type Foo = ReadonlyArray<string>;`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on Array as type member.
  {
    code: dedent`
      function foo() {
        type Foo = {
          readonly bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          readonly bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 19
      }
    ]
  },
  // Should fail on Array type alias in local type.
  {
    code: dedent`
      function foo() {
        type Foo = Array<string>;
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = ReadonlyArray<string>;
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 2,
        column: 14
      }
    ]
  },
  // Should fail on Array as type member in local type.
  {
    code: dedent`
      function foo() {
        type Foo = {
          readonly bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          readonly bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 3,
        column: 19
      }
    ]
  },
  // Should fail on Array type in variable declaration.
  {
    code: `const foo: Array<string> = [];`,
    optionsSet: [[]],
    output: `const foo: ReadonlyArray<string> = [];`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on shorthand Array syntax.
  {
    code: `const foo: number[] = [1, 2, 3];`,
    optionsSet: [[]],
    output: `const foo: readonly number[] = [1, 2, 3];`,
    errors: [
      {
        messageId: "array",
        type: "TSArrayType",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on Array type being used as template param.
  {
    code: `let x: Foo<Array<string>>;`,
    optionsSet: [[]],
    output: `let x: Foo<ReadonlyArray<string>>;`,
    errors: [
      {
        messageId: "type",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on nested shorthand arrays.
  {
    code: `let x: readonly string[][];`,
    optionsSet: [[]],
    output: `let x: readonly (readonly string[])[];`,
    errors: [
      {
        messageId: "array",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  },
  // Should fail on implicit Array type in variable declaration.
  {
    code: dedent`
      const foo = [1, 2, 3]
      function bar(param = [1, 2, 3]) {}`,
    optionsSet: [[{ checkImplicit: true }]],
    output: dedent`
      const foo: readonly unknown[] = [1, 2, 3]
      function bar(param: readonly unknown[] = [1, 2, 3]) {}`,
    errors: [
      {
        messageId: "implicit",
        type: "VariableDeclarator",
        line: 1,
        column: 7
      },
      {
        messageId: "implicit",
        type: "AssignmentPattern",
        line: 2,
        column: 14
      }
    ]
  },
  // Class Property Signatures.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }`,
    optionsSet: [[]],
    output: dedent`
      class Klass {
        readonly foo: number;
        private readonly bar: number;
        static readonly baz: number;
        private static readonly qux: number;
      }`,
    errors: [
      {
        messageId: "property",
        type: "ClassProperty",
        line: 2,
        column: 3
      },
      {
        messageId: "property",
        type: "ClassProperty",
        line: 3,
        column: 3
      },
      {
        messageId: "property",
        type: "ClassProperty",
        line: 4,
        column: 3
      },
      {
        messageId: "property",
        type: "ClassProperty",
        line: 5,
        column: 3
      }
    ]
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
      }`,
    optionsSet: [[]],
    output: dedent`
      class Klass {
        constructor (
          public readonly publicProp: string,
          protected readonly protectedProp: string,
          private readonly privateProp: string,
      ) { }
      }`,
    errors: [
      {
        messageId: "property",
        type: "TSParameterProperty",
        line: 3,
        column: 5
      },
      {
        messageId: "property",
        type: "TSParameterProperty",
        line: 4,
        column: 5
      },
      {
        messageId: "property",
        type: "TSParameterProperty",
        line: 5,
        column: 5
      }
    ]
  },
  // Interface Index Signatures.
  {
    code: dedent`
      interface Foo {
        [key: string]: string
      }
      interface Bar {
        [key: string]: { prop: string }
      }`,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly [key: string]: string
      }
      interface Bar {
        readonly [key: string]: { readonly prop: string }
      }`,
    errors: [
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 2,
        column: 3
      },
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 5,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 5,
        column: 20
      }
    ]
  },
  // Function Index Signatures.
  {
    code: dedent`
      function foo(): { [source: string]: string } {
        return undefined;
      }
      function bar(param: { [source: string]: string }): void {
        return undefined;
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): { readonly [source: string]: string } {
        return undefined;
      }
      function bar(param: { readonly [source: string]: string }): void {
        return undefined;
      }`,
    errors: [
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 1,
        column: 19
      },
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 4,
        column: 23
      }
    ]
  },
  // Type literal with indexer without readonly modifier should produce failures.
  {
    code: `let foo: { [key: string]: number };`,
    optionsSet: [[]],
    output: `let foo: { readonly [key: string]: number };`,
    errors: [
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 1,
        column: 12
      }
    ]
  },
  // Type literal in property template parameter without readonly should produce failures.
  {
    code: dedent`
      type foo = ReadonlyArray<{
        type: string,
        code: string,
      }>;`,
    optionsSet: [[]],
    output: dedent`
      type foo = ReadonlyArray<{
        readonly type: string,
        readonly code: string,
      }>;`,
    errors: [
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 2,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      }
    ]
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
      };`,
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
      };`,
    errors: [
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 2,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 4,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 5,
        column: 3
      },
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 6,
        column: 3
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 8,
        column: 5
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 9,
        column: 5
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 10,
        column: 5
      },
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 11,
        column: 5
      },
      {
        messageId: "property",
        type: "TSIndexSignature",
        line: 12,
        column: 5
      }
    ]
  },
  {
    code: dedent`
      function foo(bar: { x: number }) {
      };`,
    optionsSet: [[{ allowLocalMutation: true }]],
    output: dedent`
      function foo(bar: { readonly x: number }) {
      };`,
    errors: [
      {
        messageId: "property",
        type: "TSPropertySignature",
        line: 1,
        column: 21
      }
    ]
  },
  // Mapped type without readonly.
  {
    code: dedent`
      const func = (x: { [key in string]: number }) => {}`,
    optionsSet: [[]],
    output: dedent`
      const func = (x: { readonly [key in string]: number }) => {}`,
    errors: [
      {
        messageId: "property",
        type: "TSMappedType",
        line: 1,
        column: 18
      }
    ]
  }
];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
