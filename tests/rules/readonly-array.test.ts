/**
 * @fileoverview Tests for readonly-array
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/readonlyArray";

import { typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [
  // Should not fail on explicit ReadonlyArray parameter.
  {
    code: dedent`
      function foo(...numbers: ReadonlyArray<number>) {
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      function foo(...numbers: readonly number[]) {
      }`,
    optionsSet: [[]]
  },
  // Should not fail on explicit ReadonlyArray return type.
  {
    code: dedent`
      function foo(): ReadonlyArray<number> {
        return [1, 2, 3];
      }`,
    optionsSet: [[]]
  },
  {
    code: dedent`
      const foo = (): ReadonlyArray<number> => {
        return [1, 2, 3];
      }`,
    optionsSet: [[]]
  },
  // ReadonlyArray Tuple.
  {
    code: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray type alias.
  {
    code: `type Foo = ReadonlyArray<string>;`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray type alias in local type.
  {
    code: dedent`
      function foo() {
        type Foo = ReadonlyArray<string>;
      }`,
    optionsSet: [[]]
  },
  // Should not fail on ReadonlyArray in variable declaration.
  {
    code: `const foo: ReadonlyArray<string> = [];`,
    optionsSet: [[]]
  }
];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  {
    code: dedent`
      function foo(...numbers: number[]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: readonly number[]) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSArrayType",
        line: 1,
        column: 26
      }
    ]
  },
  {
    code: dedent`
      function foo(...numbers: Array<number>) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(...numbers: ReadonlyArray<number>) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 26
      }
    ]
  },
  // Should fail on Array type in interface.
  {
    code: dedent`
      interface Foo {
        bar: Array<string>
      }`,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        bar: ReadonlyArray<string>
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 2,
        column: 8
      }
    ]
  },
  // Should fail on Array type in index interface.
  {
    code: dedent`interface Foo {
      [key: string]: {
        groups: Array<string>
      }
    }`,
    optionsSet: [[]],
    output: dedent`interface Foo {
      [key: string]: {
        groups: ReadonlyArray<string>
      }
    }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 13
      }
    ]
  },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      function foo(): Array<string> {
        interface Foo {
          bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): ReadonlyArray<string> {
        interface Foo {
          bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 17
      },
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 10
      }
    ]
  },
  // Should fail on Array type as function return type and in local interface.
  {
    code: dedent`
      const foo = (): Array<string> => {
        interface Foo {
          bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      const foo = (): ReadonlyArray<string> => {
        interface Foo {
          bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 17
      },
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 10
      }
    ]
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: dedent`
      function foo(): number[] {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): readonly number[] {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  },
  // Should fail on shorthand syntax Array type as return type.
  {
    code: `const foo = (): number[] => {}`,
    optionsSet: [[]],
    output: `const foo = (): readonly number[] => {}`,
    errors: [
      {
        messageId: "generic",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  },
  // Should fail inside function.
  {
    code: dedent`
      const foo = function (): string {
        let bar: Array<string>;
      };`,
    optionsSet: [[]],
    output: dedent`
      const foo = function (): string {
        let bar: ReadonlyArray<string>;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 2,
        column: 12
      }
    ]
  },
  // Tuples.
  {
    code: dedent`
      function foo(tuple: [number, string]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string]) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTupleType",
        line: 1,
        column: 21
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: [number, string, [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTupleType",
        line: 1,
        column: 21
      },
      {
        messageId: "generic",
        type: "TSTupleType",
        line: 1,
        column: 38
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: readonly [number, string, [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTupleType",
        line: 1,
        column: 47
      }
    ]
  },
  {
    code: dedent`
      function foo(tuple: [number, string, readonly [number, string]]) {
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(tuple: readonly [number, string, readonly [number, string]]) {
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTupleType",
        line: 1,
        column: 21
      }
    ]
  },
  // Should fail on Array as type literal member as function parameter.
  {
    code: dedent`
      function foo(
        param1: {
          bar: Array<string>,
          baz: ReadonlyArray<string>
        }
      ): {
        bar: Array<string>,
        baz: ReadonlyArray<string>
      } {
        let foo: {
          bar: Array<string>,
          baz: ReadonlyArray<string>
        } = {
          bar: ["hello"],
          baz: ["world"]
        };
        return foo;
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(
        param1: {
          bar: ReadonlyArray<string>,
          baz: ReadonlyArray<string>
        }
      ): {
        bar: ReadonlyArray<string>,
        baz: ReadonlyArray<string>
      } {
        let foo: {
          bar: ReadonlyArray<string>,
          baz: ReadonlyArray<string>
        } = {
          bar: ["hello"],
          baz: ["world"]
        };
        return foo;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 10
      },
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 7,
        column: 8
      },
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 11,
        column: 10
      }
    ]
  },
  // Should fail on Array type alias.
  {
    code: `type Foo = Array<string>;`,
    optionsSet: [[]],
    output: `type Foo = ReadonlyArray<string>;`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on Array as type member.
  {
    code: dedent`
      function foo() {
        type Foo = {
          bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 10
      }
    ]
  },
  // Should fail on Array type alias in local type.
  {
    code: dedent`
      function foo() {
        type Foo = Array<string>;
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = ReadonlyArray<string>;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 2,
        column: 14
      }
    ]
  },
  // Should fail on Array as type member in local type.
  {
    code: dedent`
      function foo() {
        type Foo = {
          bar: Array<string>
        }
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo() {
        type Foo = {
          bar: ReadonlyArray<string>
        }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 3,
        column: 10
      }
    ]
  },
  // Should fail on Array type in variable declaration.
  {
    code: `const foo: Array<string> = [];`,
    optionsSet: [[]],
    output: `const foo: ReadonlyArray<string> = [];`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on shorthand Array syntax.
  {
    code: `const foo: number[] = [1, 2, 3];`,
    optionsSet: [[]],
    output: `const foo: readonly number[] = [1, 2, 3];`,
    errors: [
      {
        messageId: "generic",
        type: "TSArrayType",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on Array type being used as template param.
  {
    code: `let x: Foo<Array<string>>;`,
    optionsSet: [[]],
    output: `let x: Foo<ReadonlyArray<string>>;`,
    errors: [
      {
        messageId: "generic",
        type: "TSTypeReference",
        line: 1,
        column: 12
      }
    ]
  },
  // Should fail on nested shorthand arrays.
  {
    code: `let x: readonly string[][];`,
    optionsSet: [[]],
    output: `let x: readonly (readonly string[])[];`,
    errors: [
      {
        messageId: "generic",
        type: "TSArrayType",
        line: 1,
        column: 17
      }
    ]
  }
  // TODO: Should fail on implicit Array type in variable declaration.
  // - needs type information
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
