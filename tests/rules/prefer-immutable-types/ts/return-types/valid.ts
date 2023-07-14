import dedent from "dedent";

import { type rule } from "~/rules/prefer-immutable-types";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: "function foo(): boolean {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): true {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): string {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): 'bar' {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): 'undefined' {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): readonly string[] {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
    settingsSet: [
      {
        immutability: {
          overrides: [
            {
              type: { from: "lib", name: "ReadonlyArray" },
              to: "Immutable",
            },
          ],
        },
      },
    ],
  },
  {
    code: "function foo(): ReadonlyArray<string> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): readonly [string, number] {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): Readonly<[string, number]> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): { readonly foo: string } {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): { readonly foo: { readonly bar: number } } {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): { foo(): void } {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): { foo: () => void } {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): ReadonlySet<string> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): ReadonlyMap<string, string> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(): Readonly<ReadonlySet<string>> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: "function foo(): Readonly<ReadonlyMap<string, string>> {}",
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
      [{ returnTypes: "Immutable" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        (): readonly string[];
      }
    `,
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (): readonly string[];
      }
    `,
    optionsSet: [
      [{ returnTypes: "ReadonlyShallow" }],
      [{ returnTypes: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo() { return { foo: 'bar' }; }",
    optionsSet: [
      [
        {
          returnTypes: {
            enforcement: "ReadonlyShallow",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          returnTypes: {
            enforcement: "ReadonlyDeep",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          returnTypes: { enforcement: "Immutable", ignoreInferredTypes: true },
        },
      ],
    ],
  },
  // Ignore Name Prefix.
  {
    code: dedent`
      function mutableFoo(): string[] {}
    `,
    optionsSet: [[{ ignoreNamePattern: "^mutable" }]],
  },
  // Ignore Name Suffix.
  {
    code: dedent`
      function fooMutable(): string[] {}
    `,
    optionsSet: [[{ ignoreNamePattern: "Mutable$" }]],
  },
  // Ignore Type.
  {
    code: dedent`
      function foo(): Readonly<string[]> {}
    `,
    optionsSet: [[{ ignoreTypePattern: "^Readonly<.+>$" }]],
  },
];

export default tests;
