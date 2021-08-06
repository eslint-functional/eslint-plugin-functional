import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const optionsReversedDefault = [
  {
    mustBeReadonly: {
      requireOthersToBeMutable: true,
    },
    mustBeMutable: {
      requireOthersToBeReadonly: false,
    },
  },
];

const tests: ReadonlyArray<InvalidTestCase> = [
  // Readonly types should not be mutable.
  {
    code: dedent`
      type MyType = {
        a: string;
      };`,
    optionsSet: [[]],
    output: dedent`
      type MyType = {
        readonly a: string;
      };`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 2,
        column: 3,
      },
    ],
  },
  // Mutable types should not be readonly.
  {
    code: dedent`
      type MyType = {
        readonly a: string;
      };`,
    optionsSet: [optionsReversedDefault],
    errors: [
      {
        messageId: "typeAliasShouldBeMutable",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Mutable types should not be readonly.
  {
    code: dedent`
      type MutableMyType = {
        readonly a: string;
      };`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "typeAliasShouldBeMutable",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Needs Explicit Marking.
  {
    code: dedent`
      type MyType = {};`,
    optionsSet: [
      [
        {
          mustBeReadonly: {
            requireOthersToBeMutable: true,
          },
          mustBeMutable: {
            requireOthersToBeReadonly: true,
          },
        },
      ],
    ],
    errors: [
      {
        messageId: "typeAliasNeedsExplicitMarking",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Both Mutable and Readonly error.
  {
    code: dedent`
      type MyType = {};`,
    optionsSet: [
      [
        {
          mustBeReadonly: {
            pattern: ".*",
          },
          mustBeMutable: {
            pattern: ".*",
          },
        },
      ],
    ],
    errors: [
      {
        messageId: "typeAliasErrorMutableReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
  // Index Signatures.
  {
    code: dedent`
      type MyType1 = {
        [key: string]: string
      }
      type MyType2 = {
        [key: string]: { prop: string }
      }`,
    optionsSet: [[]],
    output: dedent`
      type MyType1 = {
        readonly [key: string]: string
      }
      type MyType2 = {
        readonly [key: string]: { readonly prop: string }
      }`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 2,
        column: 3,
      },
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 4,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSIndexSignature",
        line: 5,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 5,
        column: 20,
      },
    ],
  },
  // Type literal in property template parameter without readonly should produce failures.
  {
    code: dedent`
      type MyType = ReadonlyArray<{
        type: string,
        code: string,
      }>;`,
    optionsSet: [[]],
    output: dedent`
      type MyType = ReadonlyArray<{
        readonly type: string,
        readonly code: string,
      }>;`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 2,
        column: 3,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 3,
        column: 3,
      },
    ],
  },
  // Computed properties.
  {
    code: dedent`
      const propertyName = 'myProperty';
      type MyType = {
        [propertyName]: string;
      };`,
    optionsSet: [[]],
    output: dedent`
      const propertyName = 'myProperty';
      type MyType = {
        readonly [propertyName]: string;
      };`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 2,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSPropertySignature",
        line: 3,
        column: 3,
      },
    ],
  },
  // Mapped type without readonly.
  {
    code: dedent`
      type MyType = { [key in string]: number }`,
    optionsSet: [[]],
    output: dedent`
      type MyType = { readonly [key in string]: number }`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "propertyShouldBeReadonly",
        type: "TSMappedType",
        line: 1,
        column: 15,
      },
    ],
  },
  // Should fail on array in type alias.
  {
    code: `type MyType = string[];`,
    optionsSet: [[]],
    output: `type MyType = readonly string[];`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 15,
      },
    ],
  },
  // Should fail on array as type member.
  {
    code: dedent`
      type MyType = {
        readonly bar: string[]
      }`,
    optionsSet: [[]],
    output: dedent`
      type MyType = {
        readonly bar: readonly string[]
      }`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 2,
        column: 17,
      },
    ],
  },
  // Should fail on array type being used as template param.
  {
    code: `type MyType = Promise<string[]>;`,
    optionsSet: [[]],
    output: `type MyType = Promise<readonly string[]>;`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "arrayShouldBeReadonly",
        type: "TSArrayType",
        line: 1,
        column: 23,
      },
    ],
  },
  // Should fail on Array type alias.
  {
    code: `type MyType = Array<string>;`,
    optionsSet: [[]],
    output: `type MyType = ReadonlyArray<string>;`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 15,
      },
    ],
  },
  // Should fail on Array as type member.
  {
    code: dedent`
      type MyType = {
        readonly bar: Array<string>
      }`,
    optionsSet: [[]],
    output: dedent`
      type MyType = {
        readonly bar: ReadonlyArray<string>
      }`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 2,
        column: 17,
      },
    ],
  },
  // Should fail on Array type being used as template param.
  {
    code: `type MyType = Promise<Array<string>>;`,
    optionsSet: [[]],
    output: `type MyType = Promise<ReadonlyArray<string>>;`,
    errors: [
      {
        messageId: "typeAliasShouldBeReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
      {
        messageId: "typeShouldBeReadonly",
        type: "TSTypeReference",
        line: 1,
        column: 23,
      },
    ],
  },
];

export default tests;
