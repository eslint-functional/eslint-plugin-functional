import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/readonly-type";
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
      type Foo = Readonly<{
        bar: string;
      }>;
    `,
    optionsSet: [["keyword"]],
    output: dedent`
      type Foo = {
        readonly bar: string;
      };
    `,
    errors: [
      {
        messageId: "keyword",
        type: AST_NODE_TYPES.Identifier,
        line: 1,
        column: 12,
      },
    ],
  },
  {
    code: dedent`
      type Foo = {
        readonly bar: string;
      };
    `,
    optionsSet: [["generic"]],
    output: dedent`
      type Foo = Readonly<{
        bar: string;
      }>;
    `,
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSTypeLiteral,
        line: 1,
        column: 12,
      },
    ],
  },
];

export default tests;
