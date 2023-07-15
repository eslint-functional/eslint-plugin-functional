import dedent from "dedent";
import { Immutability } from "is-immutable-type";

import { type rule } from "#eslint-plugin-functional/rules/type-declaration-immutability";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const recommended = {
  rules: [
    {
      identifiers: ["^I?Immutable.+"],
      immutability: Immutability.Immutable,
      comparator: "AtLeast",
    },
    {
      identifiers: ["^I?ReadonlyDeep.+"],
      immutability: Immutability.ReadonlyDeep,
      comparator: "AtLeast",
    },
    {
      identifiers: ["^I?Readonly.+"],
      immutability: Immutability.ReadonlyShallow,
      comparator: "AtLeast",
    },
    {
      identifiers: ["^I?Mutable.+"],
      immutability: Immutability.Mutable,
      comparator: "AtMost",
    },
  ],
};

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: "type ReadonlyString = string;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number };",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyFoo = Readonly<{ foo: number }>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { baz: string; }; };",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlySet = ReadonlySet<string>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyMap = ReadonlyMap<string, string>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepString = string;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepSet = ReadonlySet<string>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepMap = ReadonlyMap<string, string>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepSet = ReadonlySet<{ readonly foo: string; }>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ReadonlyDeepMap = ReadonlyMap<string, { readonly foo: string; }>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ImmutableString = string;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ImmutableFoo = { readonly foo: number; readonly bar: { readonly baz: string; }; };",
    optionsSet: [[recommended]],
  },
  {
    code: "type ImmutableSet = Readonly<ReadonlySet<{ readonly foo: string; }>>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type ImmutableMap = Readonly<ReadonlyMap<string, { readonly foo: string; }>>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type MutableFoo = { foo: number };",
    optionsSet: [[recommended]],
  },
  {
    code: "type MutableFoo = { readonly foo: number; bar: { readonly baz: string; }; };",
    optionsSet: [[recommended]],
  },
  {
    code: "type MutableSet = Set<{ readonly foo: string; }>;",
    optionsSet: [[recommended]],
  },
  {
    code: "type MutableMap = Map<string, { readonly foo: string; }>;",
    optionsSet: [[recommended]],
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
              identifiers: "Foo",
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
              identifiers: "^I?Readonly.+",
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
      type ReadonlyDeep<T> = T;
    `,
    optionsSet: [[recommended]],
    settingsSet: [
      {
        immutability: {
          overrides: [
            {
              type: "ReadonlyDeep",
              to: Immutability.ReadonlyDeep,
            },
          ],
        },
      },
    ],
  },
];

export default tests;
