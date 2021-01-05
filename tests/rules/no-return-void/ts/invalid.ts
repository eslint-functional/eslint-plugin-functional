import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  // Disallow void.
  {
    code: dedent`
    function foo(bar: number): void {
      console.log(bar);
    }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAnnotation",
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow undefined.
  {
    code: dedent`
    function foo(bar: number): undefined {
      console.log(bar);
      return undefined;
    }`,
    optionsSet: [[{ allowUndefined: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAnnotation",
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow null.
  {
    code: dedent`
    function foo(bar: number): null {
      console.log(bar);
      return null;
    }`,
    optionsSet: [[{ allowNull: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAnnotation",
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow higher-order function void.
  {
    code: dedent`
    function foo(bar: number): (baz: number) => void {
      return baz => { console.log(bar, baz); }
    }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAnnotation",
        line: 1,
        column: 42,
      },
    ],
  },
];

export default tests;
