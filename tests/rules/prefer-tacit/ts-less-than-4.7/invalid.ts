import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-tacit";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // Instantiation Expression not supported.
  {
    code: dedent`
      function f<T>(x: T): T {}
      function foo(x) { return f<number>(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      export default function (x) { return f<number>(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 16,
      },
    ],
  },
];

export default tests;
