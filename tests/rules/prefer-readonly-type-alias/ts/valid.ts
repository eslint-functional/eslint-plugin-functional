import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const optionsReversedDefault = [
  {
    mustBeReadonly: {
      requireOthersToBeMutable: true,
    },
    mustBeMutable: {
      requireOthersToBeReadonly: false,
    },
  },
];

const tests: ReadonlyArray<ValidTestCase> = [
  // Readonly types should be readonly.
  {
    code: dedent`
      type MyType = {
        readonly a: string;
      };`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type ReadonlyMyType = {
        readonly a: string;
      };`,
    optionsSet: [optionsReversedDefault],
  },
  // Readonly types should be readonly and mutable types mutable.
  {
    code: dedent`
      type MutableMyType = {
        a: string;
      };
      type MyType = Readonly<MutableMyType>;`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type MyType = {
        a: string;
      };
      type ReadonlyMyType = Readonly<MyType>;`,
    optionsSet: [optionsReversedDefault],
  },
  // Readonly types should be readonly and mutable types mutable.
  {
    code: dedent`
      type Mutable<T> = { -readonly[P in keyof T]: T[P] };
      type MyType = {
        readonly a: string;
      };
      type MutableMyType = Mutable<MyType>;`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Mutable<T> = { -readonly[P in keyof T]: T[P] };
      type ReadonlyMyType = {
        readonly a: string;
      };
      type MyType = Mutable<ReadonlyMyType>;`,
    optionsSet: [optionsReversedDefault],
  },
  // Readonly Tuple.
  {
    code: dedent`
      type MyType = readonly [number, string, readonly [number, string]];`,
    optionsSet: [[]],
  },
  // Should not fail on ReadonlyArray type alias.
  {
    code: `type Foo = ReadonlyArray<string>;`,
    optionsSet: [[]],
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
    optionsSet: [[]],
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
    optionsSet: [[]],
  },
  // CallSignature and MethodSignature cannot have readonly modifiers and should
  // not produce failures.
  // Waiting on https://github.com/typescript-eslint/typescript-eslint/issues/1758
  // {
  //   code: dedent`
  //     interface Foo {
  //       (): void
  //       foo(): void
  //     }`,
  //   optionsSet: [
  //     [
  //       {
  //         treatMethodsAsReadonly: true,
  //       },
  //     ],
  //   ],
  // },
  // Type literal in array template parameter with readonly should not produce failures.
  {
    code: `type foo = ReadonlyArray<{ readonly type: string, readonly code: string }>;`,
    optionsSet: [[]],
  },
  // Mapped types with readonly on members should not produce failures.
  {
    code: dedent`
      type MyType = (x: { readonly [key in string]: number }) => {}`,
    optionsSet: [[]],
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
    optionsSet: [[{ ignoreInterface: true }]],
  },
];

export default tests;
