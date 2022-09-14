import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: "function foo(arg: boolean) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: true) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: string) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: 'bar') {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: 'undefined') {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: readonly string[]) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
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
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: readonly [string, number]) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<[string, number]>) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: { readonly foo: string }) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: { readonly foo: { readonly bar: number } }) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: { foo(): void }) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: { foo: () => void }) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: ReadonlySet<string>) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: ReadonlyMap<string, string>) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<ReadonlySet<string>>) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: "function foo(arg: Readonly<ReadonlyMap<string, string>>) {}",
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
      [{ enforcement: "Immutable" }],
    ],
  },
  {
    code: dedent`
      class Foo {
        constructor(
          private arg1: readonly string[],
          public arg2: readonly string[],
          protected arg3: readonly string[],
          readonly arg4: readonly string[],
        ) {}
      }
    `,
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        (arg: readonly string[]): void;
      }
    `,
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (arg: readonly string[]): void;
      }
    `,
    optionsSet: [
      [{ enforcement: "ReadonlyShallow" }],
      [{ enforcement: "ReadonlyDeep" }],
    ],
  },
];

export default tests;
