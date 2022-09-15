import { Immutableness } from "is-immutable-type";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "type ReadonlyFoo = { foo: number }",
    optionsSet: [[]],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutableness[Immutableness.ReadonlyShallow],
          actual: Immutableness[Immutableness.Mutable],
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
          expected: Immutableness[Immutableness.ReadonlyShallow],
          actual: Immutableness[Immutableness.Mutable],
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
          expected: Immutableness[Immutableness.ReadonlyShallow],
          actual: Immutableness[Immutableness.Mutable],
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
          expected: Immutableness[Immutableness.ReadonlyShallow],
          actual: Immutableness[Immutableness.Mutable],
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
          expected: Immutableness[Immutableness.ReadonlyDeep],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
          expected: Immutableness[Immutableness.ReadonlyDeep],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
          expected: Immutableness[Immutableness.ReadonlyDeep],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
          expected: Immutableness[Immutableness.Immutable],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
          expected: Immutableness[Immutableness.Immutable],
          actual: Immutableness[Immutableness.ReadonlyDeep],
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
          expected: Immutableness[Immutableness.Immutable],
          actual: Immutableness[Immutableness.ReadonlyDeep],
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
          expected: Immutableness[Immutableness.Mutable],
          actual: Immutableness[Immutableness.Immutable],
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
          expected: Immutableness[Immutableness.Mutable],
          actual: Immutableness[Immutableness.Immutable],
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
          expected: Immutableness[Immutableness.Mutable],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
              immutableness: "ReadonlyDeep",
            },
          ],
        },
      ],
    ],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutableness[Immutableness.ReadonlyDeep],
          actual: Immutableness[Immutableness.Mutable],
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
              immutableness: "ReadonlyDeep",
            },
          ],
        },
      ],
    ],
    errors: [
      {
        messageId: "AtLeast",
        data: {
          expected: Immutableness[Immutableness.ReadonlyDeep],
          actual: Immutableness[Immutableness.ReadonlyShallow],
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
        immutableness: {
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
          expected: Immutableness[Immutableness.Mutable],
          actual: Immutableness[Immutableness.ReadonlyDeep],
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
        immutableness: {
          overrides: {
            keepDefault: false,
            values: [
              {
                name: "Set",
                to: Immutableness.Immutable,
              },
            ],
          },
        },
      },
      {
        immutableness: {
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
          expected: Immutableness[Immutableness.Mutable],
          actual: Immutableness[Immutableness.Immutable],
        },
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
];

export default tests;
