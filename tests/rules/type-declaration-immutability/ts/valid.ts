import dedent from "dedent";
import { Immutability } from "is-immutable-type";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: "type ReadonlyString = string;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number };",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyFoo = Readonly<{ foo: number }>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { baz: string; }; };",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlySet = ReadonlySet<string>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyMap = ReadonlyMap<string, string>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepString = string;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepSet = ReadonlySet<string>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepMap = ReadonlyMap<string, string>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepSet = ReadonlySet<{ readonly foo: string; }>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyDeepMap = ReadonlyMap<string, { readonly foo: string; }>;",
    optionsSet: [[]],
  },
  {
    code: "type ImmutableString = string;",
    optionsSet: [[]],
  },
  {
    code: "type ImmutableFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
    optionsSet: [[]],
  },
  {
    code: "type ImmutableSet = Readonly<ReadonlySet<{ readonly foo: string; }>>;",
    optionsSet: [[]],
  },
  {
    code: "type ImmutableMap = Readonly<ReadonlyMap<string, { readonly foo: string; }>>;",
    optionsSet: [[]],
  },
  {
    code: "type MutableFoo = { foo: number };",
    optionsSet: [[]],
  },
  {
    code: "type MutableFoo = { readonly foo: number; bar: { readonly baz: string; }; };",
    optionsSet: [[]],
  },
  {
    code: "type MutableSet = Set<{ readonly foo: string; }>;",
    optionsSet: [[]],
  },
  {
    code: "type MutableMap = Map<string, { readonly foo: string; }>;",
    optionsSet: [[]],
  },
  {
    code: "type ReadonlyFoo = { foo: number };",
    optionsSet: [
      [
        {
          ignorePattern: "Foo",
        },
      ],
    ],
  },
  {
    code: "interface ReadonlyFoo { foo: number };",
    optionsSet: [
      [
        {
          ignorePattern: "Foo",
        },
      ],
      [
        {
          ignoreInterfaces: true,
        },
      ],
    ],
  },
  {
    code: "type Foo = { readonly foo: number };",
    optionsSet: [
      [
        {
          rules: [
            {
              identifier: "Foo",
              immutability: "ReadonlyDeep",
            },
          ],
        },
      ],
    ],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
    optionsSet: [
      [
        {
          rules: [
            {
              identifier: "^I?Readonly.+",
              immutability: "ReadonlyDeep",
            },
          ],
        },
      ],
    ],
  },
  {
    code: dedent`
      type ReadonlyDeepFoo = ReadonlyDeep<{ foo: { bar: string; }; }>;
    `,
    optionsSet: [[]],
    settingsSet: [
      {
        immutability: {
          overrides: [
            {
              name: "ReadonlyDeep",
              to: Immutability.ReadonlyDeep,
            },
          ],
        },
      },
    ],
  },
];

export default tests;
