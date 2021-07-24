import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Should not fail on explicit ReadonlyArray parameter.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>) {
    }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
    function foo(...numbers: readonly number[]) {
    }`,
    optionsSet: [[]],
  },
  // Should not fail on explicit ReadonlyArray return type.
  {
    code: dedent`
    function foo(): ReadonlyArray<number> {
      return [1, 2, 3];
    }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
    const foo = (): ReadonlyArray<number> => {
      return [1, 2, 3];
    }`,
    optionsSet: [[]],
  },
  // ReadonlyArray Tuple.
  {
    code: dedent`
    function foo(tuple: readonly [number, string, readonly [number, string]]) {
    }`,
    optionsSet: [[]],
  },
  // Should not fail on ReadonlyArray type alias.
  {
    code: `type Foo = ReadonlyArray<string>;`,
    optionsSet: [[]],
  },
  // Should not fail on ReadonlyArray type alias in local type.
  {
    code: dedent`
    function foo() {
      type Foo = ReadonlyArray<string>;
    }`,
    optionsSet: [[]],
  },
  // Should not fail on ReadonlyArray in variable declaration.
  {
    code: `const foo: ReadonlyArray<string> = [];`,
    optionsSet: [[]],
  },
  // Allow return type.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>): Array<number> {}
    function bar(...numbers: readonly number[]): number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type.
  {
    code: dedent`
    const foo = function(...numbers: ReadonlyArray<number>): Array<number> {}
    const bar = function(...numbers: readonly number[]): number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type.
  {
    code: dedent`
    const foo = (...numbers: ReadonlyArray<number>): Array<number> =>  {}
    const bar = (...numbers: readonly number[]): number[] =>  {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
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
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with Type Arguments.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>): Promise<Array<number>> {}
    function foo(...numbers: ReadonlyArray<number>): Promise<number[]> {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with deep Type Arguments.
  {
    code: dedent`
    type Foo<T> = { readonly x: T; };
    function foo(...numbers: ReadonlyArray<number>): Promise<Foo<Array<number>>> {}
    function foo(...numbers: ReadonlyArray<number>): Promise<Foo<number[]>> {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with Type Arguments in a tuple.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>): readonly [number, Array<number>, number] {}
    function foo(...numbers: ReadonlyArray<number>): readonly [number, number[], number] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with Type Arguments Union.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } | { readonly b: string[] } {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with Type Arguments Intersection.
  {
    code: dedent`
    function foo(...numbers: ReadonlyArray<number>): { readonly a: Array<number> } & { readonly b: string[] } {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow return type with Type Arguments Conditional.
  {
    code: dedent`
    function foo<T>(x: T): T extends Array<number> ? string : number[] {}`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Allow inline mutable return type.
  {
    code: dedent`
      function foo(bar: string): { baz: number } {
        return 1 as any;
      }`,
    optionsSet: [[{ allowMutableReturnType: true }]],
  },
  // Should not fail on implicit ReadonlyArray type in variable declaration.
  {
    code: dedent`
    const foo = [1, 2, 3] as const`,
    optionsSet: [[{ checkImplicit: true }]],
  },
  // Should not fail on implicit Array.
  {
    code: dedent`
    const foo = [1, 2, 3]
    function bar(param = [1, 2, 3]) {}`,
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
    optionsSet: [[]],
  },
  // CallSignature and MethodSignature cannot have readonly modifiers and should
  // not produce failures.
  {
    code: dedent`
    interface Foo {
      (): void
      foo(): void
    }`,
    optionsSet: [[]],
  },
  // The literal with indexer with readonly modifier should not produce failures.
  {
    code: `let foo: { readonly [key: string]: number };`,
    optionsSet: [[]],
  },
  // Type literal in array template parameter with readonly should not produce failures.
  {
    code: `type foo = ReadonlyArray<{ readonly type: string, readonly code: string }>;`,
    optionsSet: [[]],
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
    optionsSet: [[]],
  },
  // Mapped types with readonly on members should not produce failures.
  {
    code: dedent`
    const func = (x: { readonly [key in string]: number }) => {}`,
    optionsSet: [[]],
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
    optionsSet: [[{ ignoreClass: true }]],
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
    optionsSet: [[{ allowLocalMutation: true }]],
  },
  // Ignore Prefix.
  {
    code: dedent`
    let mutableFoo: string[] = [];`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
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
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
    class Klass {
      mutableA: string;
      private mutableB: string;
    }`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  // Ignore Suffix.
  {
    code: dedent`
    let fooMutable: string[] = [];`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
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
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
    class Klass {
      AMutable: string;
      private BMutable: string;
    }`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  // Allow mutable TSIndexSignature.
  {
    code: dedent`
    const mutableResult: {
      [key: string]: string
    } = {};`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  // Ignore Mutable Collections (Array, Tuple, Set, Map)
  {
    code: dedent`type Foo = Array<string>;`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo: number[] = [];`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo = []`,
    optionsSet: [[{ ignoreCollections: true, checkImplicit: true }]],
  },
  {
    code: dedent`type Foo = [string, string];`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo: [string, string] = ['foo', 'bar'];`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo = ['foo', 'bar'];`,
    optionsSet: [[{ ignoreCollections: true, checkImplicit: true }]],
  },
  {
    code: dedent`type Foo = Set<string, string>;`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo: Set<string, string> = new Set();`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`type Foo = Map<string, string>;`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
  {
    code: dedent`const Foo: Map<string, string> = new Map();`,
    optionsSet: [[{ ignoreCollections: true }]],
  },
];

export default tests;
