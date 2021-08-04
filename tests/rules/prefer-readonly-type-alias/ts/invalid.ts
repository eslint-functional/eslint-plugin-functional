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
    // output: dedent`
    //   type MyType = {
    //     readonly a: string;
    //   };`,
    errors: [
      {
        messageId: "mutable",
        type: "Identifier",
        line: 1,
        column: 6,
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
    // output: dedent`
    //   type MyType = {
    //     a: string;
    //   };`,
    errors: [
      {
        messageId: "readonly",
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
    // output: dedent`
    //   type MutableMyType = {
    //     a: string;
    //   };`,
    errors: [
      {
        messageId: "readonly",
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
        messageId: "needsExplicitMarking",
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
        messageId: "mutableReadonly",
        type: "Identifier",
        line: 1,
        column: 6,
      },
    ],
  },
];

export default tests;
