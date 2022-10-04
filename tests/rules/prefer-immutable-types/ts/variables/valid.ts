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
  // Ignore Prefix.
  {
    code: dedent`
      let mutableFoo: string[] = [];
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      class Klass {
        mutableA: number;
        private mutableB: number;
      }
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  // Ignore Suffix.
  {
    code: dedent`
      let fooMutable: string[] = [];
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      class Klass {
        AMutable: number;
        private BMutable: number;
      }
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
];

export default tests;
