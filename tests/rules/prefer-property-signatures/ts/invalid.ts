import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-property-signatures";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo2 = {
        bar(a: number, b: string): number
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz> & {
        methodSignature(): void
      }
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        nested: {
          methodSignature(): void
        }
      }>
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 3,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: Readonly<{
          deepNested: {
            methodSignature(): void
          }
        }>
      }>{}
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 4,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: {
          deepNested: Readonly<{
            methodSignature(): void
          }>
        }
      }>{}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSMethodSignature,
        line: 4,
        column: 7,
      },
    ],
  },
];

export default tests;
