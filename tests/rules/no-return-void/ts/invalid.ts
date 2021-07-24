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
    optionsSet: [[{ ignoreImplicit: true }]],
    errors: [
      {
        messageId: "generic",
        type: "TSTypeAnnotation",
        line: 1,
        column: 42,
      },
    ],
  },
  // Disallow implicit return type.
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }`,
    optionsSet: [
      [{ ignoreImplicit: false }],
      [{ ignoreImplicit: false, allowNull: false }],
      [{ ignoreImplicit: false, allowUndefined: false }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "FunctionDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
