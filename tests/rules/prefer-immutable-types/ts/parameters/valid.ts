import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-immutable-types";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: "function foo(arg: boolean) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: true) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: string) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: 'bar') {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: 'undefined') {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: readonly string[]) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
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
    code: "function foo(arg: ReadonlyArray<string>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: readonly [string, number]) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<[string, number]>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: { readonly foo: string }) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: { readonly foo: { readonly bar: number } }) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: { foo(): void }) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: { foo: () => void }) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: ReadonlySet<string>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: ReadonlyMap<string, string>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<ReadonlySet<string>>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<ReadonlyMap<string, string>>) {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  {
    code: dedent`
      class Foo {
        constructor(
          private readonly arg1: readonly string[],
          public readonly arg2: readonly string[],
          protected readonly arg3: readonly string[],
          readonly arg4: readonly string[],
        ) {}
      }
    `,
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        (arg: readonly string[]): void;
      }
    `,
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (arg: readonly string[]): void;
      }
    `,
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      type Callback<T> = (options: T) => void;
      declare const acceptsCallback: <T>(callback: Callback<T>) => void;
      interface CallbackOptions {
        prop: string;
      }
      acceptsCallback<CallbackOptions>(options => {});
    `,
    optionsSet: [
      [
        {
          parameters: {
            enforcement: "ReadonlyShallow",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          parameters: {
            enforcement: "ReadonlyDeep",
            ignoreInferredTypes: true,
          },
        },
      ],
      [
        {
          parameters: { enforcement: "Immutable", ignoreInferredTypes: true },
        },
      ],
    ],
  },
  {
    code: "function foo(arg: { foo: string | number }): arg is { foo: number } {}",
    optionsSet: [
      [{ parameters: "ReadonlyShallow" }],
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
  },
  // Ignore Name Prefix.
  {
    code: dedent`
      function foo(mutableArg: string[]) {}
    `,
    optionsSet: [[{ ignoreNamePattern: "^mutable" }]],
  },
  // Inherit Ignore Name Prefix.
  {
    code: dedent`
      function foo(mutableArg: string[]) {}
    `,
    optionsSet: [
      [
        {
          ignoreNamePattern: "^mutable",
          parameters: {
            enforcement: "Immutable",
          },
        },
      ],
    ],
  },
  // Ignore Name Suffix.
  {
    code: dedent`
      function foo(argMutable: string[]) {}
    `,
    optionsSet: [[{ ignoreNamePattern: "Mutable$" }]],
  },
  // Ignore Type.
  {
    code: dedent`
      function foo(arg: Readonly<string[]>) {}
    `,
    optionsSet: [[{ ignoreTypePattern: "^Readonly<.+>$" }]],
  },
  {
    code: dedent`
      type Foo<T> = readonly T[];
      function foo(arg: Foo<{ bar: string; }>) { }
    `,
    optionsSet: [
      [
        {
          parameters: "ReadonlyDeep",
          overrides: [
            {
              specifiers: {
                from: "file",
              },
              disable: true,
            },
          ],
        },
      ],
      [
        {
          parameters: "ReadonlyDeep",
          overrides: [
            {
              specifiers: {
                from: "file",
              },
              options: {
                parameters: "ReadonlyShallow",
              },
            },
          ],
        },
      ],
    ],
  },
];

export default tests;
