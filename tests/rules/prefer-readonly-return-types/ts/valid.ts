import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Should not fail on shorthand syntax readonly array type as return type.
  {
    code: dedent`
      function foo(): readonly number[] {}
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      const foo = (): readonly number[] => {}
    `,
    optionsSet: [[]],
  },
  // Should not fail on longhand syntax readonly array type as return type.
  {
    code: dedent`
      function foo(): ReadonlyArray<number> {}
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      const foo = (): ReadonlyArray<number> => {}
    `,
    optionsSet: [[]],
  },
  // Allow inline immutable return type.
  {
    code: dedent`
      function foo(bar: string): { readonly baz: number } {}
    `,
    optionsSet: [[]],
  },
  // Interfaces with functions with immutable return types should not produce failures.
  {
    code: dedent`
      interface Foo {
        a: () => readonly string[],
      }
    `,
    optionsSet: [[]],
  },
  // Type aliases with functions with immutable return types should not produce failures.
  {
    code: dedent`
      type Foo = {
        a: () => readonly string[],
      };
    `,
    optionsSet: [[]],
  },
  // Ignore Classes.
  {
    code: dedent`
      class Klass {
        a(): string[] {}
      }
    `,
    optionsSet: [[{ ignoreClass: true }]],
  },
  // Ignore Interfaces.
  {
    code: dedent`
      interface Foo {
        a: () => string[],
      }
    `,
    optionsSet: [[{ ignoreInterface: true }]],
  },
  // TODO: Allow Local.
  // TODO: Ignore Prefix.
  // TODO: Ignore Suffix.
  // Readonly method signature.
  {
    code: dedent`
      type Foo = {
        a: () => Readonly<{
          methodSignature(): string;
        }>,
      }
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo = {
        a: () => Readonly<{
          methodSignature1(): string;
        }> | Readonly<{
          methodSignature2(): number;
        }>,
      };
    `,
    optionsSet: [[]],
  },
  // Mutable method signature treated as readonly.
  {
    code: dedent`
      type Foo = {
        a: () => {
          methodSignature(): string;
        },
      }
    `,
    optionsSet: [
      [
        {
          treatMethodsAsReadonly: true,
        },
      ],
    ],
  },
  {
    code: dedent`
      type Foo = {
        a: () => {
          methodSignature1(): string;
        } | {
          methodSignature2(): number;
        },
      };
    `,
    optionsSet: [
      [
        {
          treatMethodsAsReadonly: true,
        },
      ],
    ],
  },
  // Ignore inferred types.
  {
    code: dedent`
      function foo() {
        return [1, 2, 3]
      }
    `,
    optionsSet: [
      [
        {
          ignoreInferredTypes: true,
        },
      ],
    ],
  },
];

export default tests;
