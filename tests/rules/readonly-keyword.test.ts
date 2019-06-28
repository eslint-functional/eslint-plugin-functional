/**
 * @fileoverview Tests for readonly-keyword
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/readonlyKeyword";

import { typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: Array<ValidTestCase> = [
  // Interface with readonly modifiers should not produce failures.
  {
    code: dedent`
      interface Foo {
        readonly a: number,
        readonly b: Array<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string },
        readonly [key: string]: string,
      }`,
    optionsSet: [[]]
  },
  // PropertySignature and IndexSignature members without readonly modifier
  // should produce failures. Also verify that nested members are checked.
  {
    code: dedent`
      interface Foo {
        readonly a: number,
        readonly b: Array<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string },
        readonly [key: string]: string,
        readonly e: {
          readonly a: number,
          readonly b: Array<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string },
          readonly [key: string]: string,
        }
      }`,
    optionsSet: [[]]
  },
  // CallSignature and MethodSignature cannot have readonly modifiers and should
  // not produce failures.
  {
    code: dedent`
      interface Foo {
        (): void
        foo(): void
      }`,
    optionsSet: [[]]
  },
  // The literal with indexer with readonly modifier should not produce failures.
  {
    code: `let foo: { readonly [key: string]: number };`,
    optionsSet: [[]]
  },
  // Type literal in array template parameter with readonly should not produce failures.
  {
    code: `type foo = ReadonlyArray<{ readonly type: string, readonly code: string }>;`,
    optionsSet: [[]]
  },
  // Type literal with readonly on members should not produce failures.
  {
    code: dedent`
      let foo: {
        readonly a: number,
        readonly b: Array<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string }
        readonly [key: string]: string
      };`,
    optionsSet: [[]]
  },
  // Ignore Classes.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }`,
    optionsSet: [[{ ignoreClass: true }]]
  },
  // Ignore Interfaces.
  {
    code: dedent`
      interface Foo {
        foo: number,
        bar: Array<string>,
        baz: () => string,
        qux: { [key: string]: string }
      }`,
    optionsSet: [[{ ignoreInterface: true }]]
  },
  // Ignore Local.
  {
    code: dedent`
      function foo() {
        let foo: {
          a: number,
          b: Array<string>,
          c: () => string,
          d: { [key: string]: string },
          [key: string]: string,
          readonly d: {
            a: number,
            b: Array<string>,
            c: () => string,
            d: { [key: string]: string },
            [key: string]: string,
          }
        }
      };`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  // Ignore Prefix.
  {
    code: dedent`
      let foo: {
        mutableA: number,
        mutableB: Array<string>,
        mutableC: () => string,
        mutableD: { readonly [key: string]: string },
        mutableE: {
          mutableA: number,
          mutableB: Array<string>,
          mutableC: () => string,
          mutableD: { readonly [key: string]: string },
        }
      };`,
    optionsSet: [[{ ignorePattern: "mutable*" }], [{ ignorePrefix: "mutable" }]]
  },
  // Ignore Suffix.
  {
    code: dedent`
      let foo: {
        aMutable: number,
        bMutable: Array<string>,
        cMutable: () => string,
        dMutable: { readonly [key: string]: string },
        eMutable: {
          aMutable: number,
          bMutable: Array<string>,
          cMutable: () => string,
          dMutable: { readonly [key: string]: string },
        }
      };`,
    optionsSet: [[{ ignorePattern: "*Mutable" }], [{ ignoreSuffix: "Mutable" }]]
  }
];

// Invalid test cases.
const invalid: Array<InvalidTestCase> = [
  // Class Property Signatures.
  {
    code: dedent`
      class Klass {
        foo: number;
        private bar: number;
        static baz: number;
        private static qux: number;
      }`,
    optionsSet: [[]],
    output: dedent`
      class Klass {
        readonly foo: number;
        private readonly bar: number;
        static readonly baz: number;
        private static readonly qux: number;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "ClassProperty",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "ClassProperty",
        line: 3,
        column: 3
      },
      {
        messageId: "generic",
        type: "ClassProperty",
        line: 4,
        column: 3
      },
      {
        messageId: "generic",
        type: "ClassProperty",
        line: 5,
        column: 3
      }
    ]
  },
  // Interface Index Signatures.
  {
    code: dedent`
      interface Foo {
        [key: string]: string
      }
      interface Bar {
        [key: string]: { prop: string }
      }`,
    optionsSet: [[]],
    output: dedent`
      interface Foo {
        readonly [key: string]: string
      }
      interface Bar {
        readonly [key: string]: { readonly prop: string }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 5,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 5,
        column: 20
      }
    ]
  },
  // Function Index Signatures.
  {
    code: dedent`
      function foo(): { [source: string]: string } {
        return undefined;
      }
      function bar(param: { [source: string]: string }): void {
        return undefined;
      }`,
    optionsSet: [[]],
    output: dedent`
      function foo(): { readonly [source: string]: string } {
        return undefined;
      }
      function bar(param: { readonly [source: string]: string }): void {
        return undefined;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 1,
        column: 19
      },
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 4,
        column: 23
      }
    ]
  },
  // Type literal with indexer without readonly modifier should produce failures.
  {
    code: `let foo: { [key: string]: number };`,
    optionsSet: [[]],
    output: `let foo: { readonly [key: string]: number };`,
    errors: [
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 1,
        column: 12
      }
    ]
  },
  // Type literal in array template parameter without readonly should produce failures.
  {
    code: dedent`
      type foo = ReadonlyArray<{
        type: string,
        code: string,
      }>;`,
    optionsSet: [[]],
    output: dedent`
      type foo = ReadonlyArray<{
        readonly type: string,
        readonly code: string,
      }>;`,
    errors: [
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      }
    ]
  },
  // Type literal without readonly on members should produce failures.
  // Also verify that nested members are checked.
  {
    code: dedent`
      let foo: {
        a: number,
        b: Array<string>,
        c: () => string,
        d: { readonly [key: string]: string },
        [key: string]: string,
        readonly e: {
          a: number,
          b: Array<string>,
          c: () => string,
          d: { readonly [key: string]: string },
          [key: string]: string,
        }
      };`,
    optionsSet: [[]],
    output: dedent`
      let foo: {
        readonly a: number,
        readonly b: Array<string>,
        readonly c: () => string,
        readonly d: { readonly [key: string]: string },
        readonly [key: string]: string,
        readonly e: {
          readonly a: number,
          readonly b: Array<string>,
          readonly c: () => string,
          readonly d: { readonly [key: string]: string },
          readonly [key: string]: string,
        }
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 3,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 4,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 5,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 6,
        column: 3
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 8,
        column: 5
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 9,
        column: 5
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 10,
        column: 5
      },
      {
        messageId: "generic",
        type: "TSPropertySignature",
        line: 11,
        column: 5
      },
      {
        messageId: "generic",
        type: "TSIndexSignature",
        line: 12,
        column: 5
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
