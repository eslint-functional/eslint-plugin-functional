import dedent from "dedent";
import { Immutability } from "is-immutable-type";

import type { InvalidTestCase } from "~/tests/helpers/util";

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
      fixer: [
        {
          pattern: "^(Array|Map|Set)<(.+)>$",
          replace: "Readonly$1<$2>",
        },
        {
          pattern: "^(.+)$",
          replace: "Readonly<$1>",
        },
      ],
    },
    {
      identifiers: ["^I?Mutable.+"],
      immutability: Immutability.Mutable,
      comparator: "AtMost",
      fixer: [
        {
          pattern: "^Readonly(Array|Map|Set)<(.+)>$",
          replace: "$1<$2>",
        },
        {
          pattern: "^Readonly<(.+)>$",
          replace: "$1",
        },
      ],
    },
  ],
};

const tests: InvalidTestCase[] = [
  {
    code: dedent`
      type ReadonlyFoo = { foo: number }
    `,
    optionsSet: [[recommended]],
    output: dedent`
      type ReadonlyFoo = Readonly<{ foo: number }>
    `,
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
    code: dedent`
      type ReadonlyFoo = {
        readonly foo: number;
        bar: {
          baz: string;
        };
      }
    `,
    optionsSet: [[recommended]],
    output: dedent`
      type ReadonlyFoo = Readonly<{
        readonly foo: number;
        bar: {
          baz: string;
        };
      }>
    `,
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
    code: dedent`
      type ReadonlyMySet = Set<string>;
    `,
    optionsSet: [[recommended]],
    output: dedent`
      type ReadonlyMySet = ReadonlySet<string>;
    `,
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
    code: dedent`
      type ReadonlyMyMap = Map<string, string>;
    `,
    output: dedent`
      type ReadonlyMyMap = ReadonlyMap<string, string>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ReadonlyDeepFoo = {
        readonly foo: number;
        readonly bar: { baz: string; };
      }
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ReadonlyDeepSet = ReadonlySet<{ foo: string; }>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ReadonlyDeepMap = ReadonlyMap<string, { foo: string; }>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ImmutableFoo = {
        readonly foo: number;
        readonly bar: { baz: string; };
      }
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ImmutableSet = ReadonlySet<{ readonly foo: string; }>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type ImmutableMap = ReadonlyMap<string, { readonly foo: string; }>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type MutableString = string
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type MutableFoo = { readonly foo: number }
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type MutableFoo = Readonly<{ foo: number }>
    `,
    optionsSet: [[recommended]],
    output: dedent`
      type MutableFoo = { foo: number }
    `,
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
    code: dedent`
      type MutableFoo = {
        readonly foo: number;
        readonly bar: { baz: string; };
      }
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type Foo = { foo: number }
    `,
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
    code: dedent`
      type ReadonlyFoo = {
        readonly foo: number;
        readonly bar: { baz: string; };
      };
    `,
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
    code: dedent`
      type MutableSet = Set<string>;
    `,
    optionsSet: [[recommended]],
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
    code: dedent`
      type MutableSet = Set<string>;
    `,
    optionsSet: [[recommended]],
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
