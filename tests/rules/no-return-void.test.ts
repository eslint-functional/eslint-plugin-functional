/**
 * @file Tests for no-return-void.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-return-void";

import { typescript } from "../helpers/configs";
import {
  describeTsOnly,
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase,
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function foo(bar) {
        return bar + 1;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  {
    code: dedent`
      function foo(bar: number): number {
        return bar + 1;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: false }]],
  },
  // Not testing implicit return types, therefore this is valid.
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }`,
    optionsSet: [
      [{ ignoreImplicit: true }],
      [{ ignoreImplicit: true, allowNull: false }],
      [{ ignoreImplicit: true, allowUndefined: false }],
    ],
  },
  // Allow null.
  {
    code: dedent`
      function foo(): null {
        return null;
      }`,
    optionsSet: [[], [{ allowNull: true }], [{ allowUndefined: false }]],
  },
  // Allow undefined.
  {
    code: dedent`
      function foo(): undefined {
        return undefined;
      }`,
    optionsSet: [[], [{ allowNull: false }], [{ allowUndefined: true }]],
  },
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
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

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});
