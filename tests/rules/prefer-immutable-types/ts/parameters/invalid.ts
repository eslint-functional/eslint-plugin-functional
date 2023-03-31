import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "function foo(arg: ReadonlySet<string>) {}",
    optionsSet: [[{ parameters: "Immutable" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
      },
    ],
  },
  {
    code: "function foo(arg: ReadonlyMap<string, string>) {}",
    optionsSet: [[{ parameters: "Immutable" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
      },
    ],
  },
  {
    code: "function foo(arg1: { foo: string }, arg2: { foo: number }) {}",
    optionsSet: [[{ parameters: "ReadonlyShallow" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
        suggestions: [
          {
            output:
              "function foo(arg1: Readonly<{ foo: string }>, arg2: { foo: number }) {}",
          },
        ],
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 37,
        suggestions: [
          {
            output:
              "function foo(arg1: { foo: string }, arg2: Readonly<{ foo: number }>) {}",
          },
        ],
      },
    ],
  },
  {
    code: "function foo(arg1: { foo: string }, arg2: { foo: number }) {}",
    optionsSet: [
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 37,
      },
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
    optionsSet: [[{ parameters: "Immutable" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 3,
        column: 22,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 4,
        column: 21,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 5,
        column: 24,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 6,
        column: 14,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        (arg: readonly string[]): void;
      }
    `,
    optionsSet: [[{ parameters: "Immutable" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 2,
        column: 4,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        new (arg: readonly string[]): void;
      }
    `,
    optionsSet: [[{ parameters: "Immutable" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 2,
        column: 8,
      },
    ],
  },
  // Class Parameter Properties.
  {
    code: dedent`
      class Klass {
        constructor (
          public publicProp: string,
          protected protectedProp: string,
          private privateProp: string,
      ) { }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "propertyModifier",
        type: "TSParameterProperty",
        line: 3,
        column: 5,
        suggestions: [
          {
            output: dedent`
              class Klass {
                constructor (
                  public readonly publicProp: string,
                  protected protectedProp: string,
                  private privateProp: string,
              ) { }
              }
            `,
          },
        ],
      },
      {
        messageId: "propertyModifier",
        type: "TSParameterProperty",
        line: 4,
        column: 5,
        suggestions: [
          {
            output: dedent`
              class Klass {
                constructor (
                  public publicProp: string,
                  protected readonly protectedProp: string,
                  private privateProp: string,
              ) { }
              }
            `,
          },
        ],
      },
      {
        messageId: "propertyModifier",
        type: "TSParameterProperty",
        line: 5,
        column: 5,
        suggestions: [
          {
            output: dedent`
              class Klass {
                constructor (
                  public publicProp: string,
                  protected protectedProp: string,
                  private readonly privateProp: string,
              ) { }
              }
            `,
          },
        ],
      },
    ],
  },
  {
    code: "function foo(arg0: { foo: string | number }, arg1: { foo: string | number }): arg0 is { foo: number } {}",
    optionsSet: [[{ parameters: "ReadonlyShallow" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 46,
        suggestions: [
          {
            output:
              "function foo(arg0: { foo: string | number }, arg1: Readonly<{ foo: string | number }>): arg0 is { foo: number } {}",
          },
        ],
      },
    ],
  },
  {
    code: "function foo(arg0: { foo: string | number }, arg1: { foo: string | number }): arg0 is { foo: number } {}",
    optionsSet: [
      [{ parameters: "ReadonlyDeep" }],
      [{ parameters: "Immutable" }],
    ],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 46,
      },
    ],
  },
  {
    code: "function foo(arg1: { foo: string }) {}",
    optionsSet: [
      [
        {
          parameters: "ReadonlyDeep",
          suggestions: {
            ReadonlyDeep: [
              [
                {
                  pattern: "^(.+)$",
                  replace: "ReadonlyDeep<$1>",
                },
              ],
            ],
          },
        },
      ],
    ],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
        suggestions: [
          {
            output: "function foo(arg1: ReadonlyDeep<{ foo: string }>) {}",
          },
        ],
      },
    ],
  },
  {
    code: "function foo(arg1: { foo: { bar: string } }) {}",
    optionsSet: [
      [
        {
          parameters: "ReadonlyDeep",
          suggestions: {
            ReadonlyDeep: [
              [
                {
                  pattern: "^Readonly<(.+)>|(.+)$",
                  replace: "ReadonlyDeep<$1$2>",
                },
              ],
            ],
          },
        },
      ],
    ],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
        suggestions: [
          {
            output:
              "function foo(arg1: ReadonlyDeep<{ foo: { bar: string } }>) {}",
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: Array<string>) {}
      function foo(arg: string[]) {}
      function foo(arg: Set<string>) {}
      function foo(arg: Map<string, string>) {}
      function foo(arg: ReadonlyArray<string>) {}
      function foo(arg: readonly string[]) {}
      function foo(arg: ReadonlySet<string>) {}
      function foo(arg: ReadonlyMap<string, string>) {}
    `,
    optionsSet: [[{ parameters: "ReadonlyShallow" }]],
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
        suggestions: [
          {
            output: dedent`
              function foo(arg: ReadonlyArray<string>) {}
              function foo(arg: string[]) {}
              function foo(arg: Set<string>) {}
              function foo(arg: Map<string, string>) {}
              function foo(arg: ReadonlyArray<string>) {}
              function foo(arg: readonly string[]) {}
              function foo(arg: ReadonlySet<string>) {}
              function foo(arg: ReadonlyMap<string, string>) {}
            `,
          },
        ],
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 2,
        column: 14,
        suggestions: [
          {
            output: dedent`
              function foo(arg: Array<string>) {}
              function foo(arg: readonly string[]) {}
              function foo(arg: Set<string>) {}
              function foo(arg: Map<string, string>) {}
              function foo(arg: ReadonlyArray<string>) {}
              function foo(arg: readonly string[]) {}
              function foo(arg: ReadonlySet<string>) {}
              function foo(arg: ReadonlyMap<string, string>) {}
            `,
          },
        ],
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 3,
        column: 14,
        suggestions: [
          {
            output: dedent`
              function foo(arg: Array<string>) {}
              function foo(arg: string[]) {}
              function foo(arg: ReadonlySet<string>) {}
              function foo(arg: Map<string, string>) {}
              function foo(arg: ReadonlyArray<string>) {}
              function foo(arg: readonly string[]) {}
              function foo(arg: ReadonlySet<string>) {}
              function foo(arg: ReadonlyMap<string, string>) {}
            `,
          },
        ],
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 4,
        column: 14,
        suggestions: [
          {
            output: dedent`
              function foo(arg: Array<string>) {}
              function foo(arg: string[]) {}
              function foo(arg: Set<string>) {}
              function foo(arg: ReadonlyMap<string, string>) {}
              function foo(arg: ReadonlyArray<string>) {}
              function foo(arg: readonly string[]) {}
              function foo(arg: ReadonlySet<string>) {}
              function foo(arg: ReadonlyMap<string, string>) {}
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: Array<{foo: string}>) {}
      function foo(arg: Set<{foo: string}>) {}
      function foo(arg: Map<{foo: string}, {foo: string}>) {}
      function foo(arg: ReadonlyArray<{foo: string}>) {}
      function foo(arg: ReadonlySet<{foo: string}>) {}
      function foo(arg: ReadonlyMap<{foo: string}, {foo: string}>) {}
      function foo(arg: {foo: string}[]) {}
      function foo(arg: readonly {foo: string}[]) {}
    `,
    optionsSet: [
      [
        {
          parameters: "ReadonlyDeep",
          fixer: {
            ReadonlyDeep: [
              {
                pattern: "^Readonly<(.+)>|(.+)$",
                replace: "ReadonlyDeep<$1$2>",
              },
            ],
          },
        },
      ],
    ],
    output: dedent`
      function foo(arg: ReadonlyDeep<Array<{foo: string}>>) {}
      function foo(arg: ReadonlyDeep<Set<{foo: string}>>) {}
      function foo(arg: ReadonlyDeep<Map<{foo: string}, {foo: string}>>) {}
      function foo(arg: ReadonlyDeep<ReadonlyArray<{foo: string}>>) {}
      function foo(arg: ReadonlyDeep<ReadonlySet<{foo: string}>>) {}
      function foo(arg: ReadonlyDeep<ReadonlyMap<{foo: string}, {foo: string}>>) {}
      function foo(arg: ReadonlyDeep<{foo: string}[]>) {}
      function foo(arg: ReadonlyDeep<readonly {foo: string}[]>) {}
    `,
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 2,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 3,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 4,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 5,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 6,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 7,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 8,
        column: 14,
      },
    ],
  },
  {
    code: dedent`
      function foo(arg: Array<string>) {}
      function foo(arg: string[]) {}
      function foo(arg: Set<string>) {}
      function foo(arg: Map<string, string>) {}
      function foo(arg: ReadonlyArray<string>) {}
      function foo(arg: readonly string[]) {}
      function foo(arg: ReadonlySet<string>) {}
      function foo(arg: ReadonlyMap<string, string>) {}
    `,
    optionsSet: [
      [
        {
          parameters: "Immutable",
          fixer: {
            Immutable: [
              {
                pattern: "^(?:Readonly)?(Set|Map)<(.+)>$",
                replace: "Readonly<Readonly$1<$2>>",
              },
            ],
          },
        },
      ],
    ],
    output: dedent`
      function foo(arg: Array<string>) {}
      function foo(arg: string[]) {}
      function foo(arg: Readonly<ReadonlySet<string>>) {}
      function foo(arg: Readonly<ReadonlyMap<string, string>>) {}
      function foo(arg: ReadonlyArray<string>) {}
      function foo(arg: readonly string[]) {}
      function foo(arg: Readonly<ReadonlySet<string>>) {}
      function foo(arg: Readonly<ReadonlyMap<string, string>>) {}
    `,
    errors: [
      {
        messageId: "parameter",
        type: "Identifier",
        line: 1,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 2,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 3,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 4,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 5,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 6,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 7,
        column: 14,
      },
      {
        messageId: "parameter",
        type: "Identifier",
        line: 8,
        column: 14,
      },
    ],
  },
];

export default tests;
