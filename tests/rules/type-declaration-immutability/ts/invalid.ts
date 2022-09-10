import { Immutability } from "is-immutable-type";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "type ReadonlyFoo = { foo: number }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyShallow],
          actual: Immutability[Immutability.Mutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number; bar: { baz: string; }; }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyShallow],
          actual: Immutability[Immutability.Mutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlySet = Set<string>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyShallow],
          actual: Immutability[Immutability.Mutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyMap = Map<string, string>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyShallow],
          actual: Immutability[Immutability.Mutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyDeepFoo = { readonly foo: number; readonly bar: { baz: string; }; }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyDeep],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyDeepSet = ReadonlySet<{ foo: string; }>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyDeep],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyDeepMap = ReadonlyMap<string, { foo: string; }>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyDeep],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ImmutableFoo = { readonly foo: number; readonly bar: { baz: string; }; }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.Immutable],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ImmutableSet = ReadonlySet<{ readonly foo: string; }>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.Immutable],
          actual: Immutability[Immutability.ReadonlyDeep],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ImmutableMap = ReadonlyMap<string, { readonly foo: string; }>;",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.Immutable],
          actual: Immutability[Immutability.ReadonlyDeep],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type MutableString = string",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtMost",
        data: {
          expected: Immutability[Immutability.Mutable],
          actual: Immutability[Immutability.Immutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type MutableFoo = { readonly foo: number }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtMost",
        data: {
          expected: Immutability[Immutability.Mutable],
          actual: Immutability[Immutability.Immutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type MutableFoo = { readonly foo: number; readonly bar: { baz: string; }; }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtMost",
        data: {
          expected: Immutability[Immutability.Mutable],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type Foo = { foo: number }",
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
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyDeep],
          actual: Immutability[Immutability.Mutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type ReadonlyFoo = { readonly foo: number; readonly bar: { baz: string; }; };",
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
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutability[Immutability.ReadonlyDeep],
          actual: Immutability[Immutability.ReadonlyShallow],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type MutableSet = Set<string>;",
    optionsSet: [[]],
    settingsSet: [
      {
        immutability: {
          overrides: {
            keepDefault: false,
          },
        },
      },
    ],
    errors: [
      {
        messageId: "AtMost",
        data: {
          expected: Immutability[Immutability.Mutable],
          actual: Immutability[Immutability.ReadonlyDeep],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: "type MutableSet = Set<string>;",
    optionsSet: [[]],
    settingsSet: [
      {
        immutability: {
          overrides: {
            keepDefault: false,
            values: [
              {
                name: "Set",
                to: Immutability.Immutable,
              },
            ],
          },
        },
      },
      {
        immutability: {
          overrides: {
            keepDefault: false,
            values: [
              {
                name: "Set",
                to: "Immutable",
              },
            ],
          },
        },
      },
    ],
    errors: [
      {
        messageId: "AtMost",
        data: {
          expected: Immutability[Immutability.Mutable],
          actual: Immutability[Immutability.Immutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
];

export default tests;
