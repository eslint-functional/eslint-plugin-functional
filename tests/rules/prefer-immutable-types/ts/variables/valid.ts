import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: "const foo: boolean = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: true = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: string = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: 'bar' = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: 'undefined' = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: readonly string[] = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
    settingsSet: [
      {
        immutability: {
          overrides: [
            {
              name: "ReadonlyArray",
              to: "Immutable",
            },
          ],
        },
      },
    ],
  },
  {
    code: "const foo: ReadonlyArray<string> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: readonly [string, number] = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: Readonly<[string, number]> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: { readonly foo: string } = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: { readonly foo: { readonly bar: number } } = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: { foo(): void } = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: { foo: () => void } = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: ReadonlySet<string> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: ReadonlyMap<string, string> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
    ],
  },
  {
    code: "const foo: Readonly<ReadonlySet<string>> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo: Readonly<ReadonlyMap<string, string>> = {} as any",
    optionsSet: [
      [{ variables: "ReadonlyShallow" }],
      [{ variables: "ReadonlyDeep" }],
      [{ variables: "Immutable" }],
    ],
  },
  {
    code: "const foo = { foo: 'bar' };",
    optionsSet: [
      [
        {
          variables: {
            enforcement: "ReadonlyShallow",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          variables: {
            enforcement: "ReadonlyDeep",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          variables: { enforcement: "Immutable", ignoreInferredTypes: true },
        },
      ],
    ],
  },
  // Destructuring array.
  {
    code: dedent`
      const [a, b] = [1, 2];
    `,
    optionsSet: [[{ variables: "Immutable" }]],
  },
  // Destructuring object.
  {
    code: dedent`
      const { a, b } = { a: 1, b: 2 };
    `,
    optionsSet: [[{ variables: "Immutable" }]],
  },
  {
    code: dedent`
      const foo: Readonly<Foo<{bar: string}>> = {} as any;

      interface Foo<P = {}> {
        (param: P): string;
        baz: string;
      }
    `,
    optionsSet: [[{ variables: "ReadonlyShallow" }]],
  },
  // Ignore Classes.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }
    `,
    optionsSet: [[{ ignoreClasses: true }]],
  },
  // Allow Local.
  {
    code: dedent`
      function foo() {
        let foo: {
          a: { foo: number },
          b: string[],
          c: { [key: string]: string[] },
          [key: string]: any,
        }
      };
    `,
    optionsSet: [[{ variables: { ignoreInFunctions: true } }]],
  },
  // Ignore Name Prefix.
  {
    code: dedent`
      let mutableFoo: string[] = [];
    `,
    optionsSet: [[{ ignoreNamePattern: "^mutable" }]],
  },
  {
    code: dedent`
      class Klass {
        mutableA: number;
        private mutableB: number;
      }
    `,
    optionsSet: [[{ ignoreNamePattern: "^mutable" }]],
  },
  // Ignore Name Suffix.
  {
    code: dedent`
      let fooMutable: string[] = [];
    `,
    optionsSet: [[{ ignoreNamePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      class Klass {
        AMutable: number;
        private BMutable: number;
      }
    `,
    optionsSet: [[{ ignoreNamePattern: "Mutable$" }]],
  },
  // Ignore Type.
  {
    code: dedent`
      let fooMutable: Readonly<string[]> = [];
    `,
    optionsSet: [[{ ignoreTypePattern: "^Readonly<.+>$" }]],
  },
  // Ignore Type (multiline).
  {
    code: dedent`
      let fooMutable: Readonly<
        string[]
      > = [];
    `,
    optionsSet: [[{ ignoreTypePattern: "^Readonly<.+>$" }]],
  },
];

export default tests;
