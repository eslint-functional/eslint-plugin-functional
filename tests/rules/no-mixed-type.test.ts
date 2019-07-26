/**
 * @file Tests for no-mixed-type.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-mixed-type";

import { typescript } from "../helpers/configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  // Only properties should not produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]]
  },
  // Only functions should not produce failures
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]]
  },
  // Only indexer should not produce failures
  {
    code: dedent`
      type Foo = {
        [key: string]: string;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]]
  },
  {
    code: dedent`
      interface Foo {
        [key: string]: string;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]]
  },
  // Check Off.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo(): number;
      };`,
    optionsSet: [[{ checkTypeLiterals: false }]]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    optionsSet: [[{ checkInterfaces: false }]]
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: () => number;
      };`,
    optionsSet: [[{ checkTypeLiterals: false }]]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }`,
    optionsSet: [[{ checkInterfaces: false }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  // Mixing properties and methods (MethodSignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo(): number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 3,
        column: 3
      }
    ]
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: () => number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
