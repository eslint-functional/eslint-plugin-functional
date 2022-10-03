import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
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
              name: "ReadonlyArray",
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
];

export default tests;
