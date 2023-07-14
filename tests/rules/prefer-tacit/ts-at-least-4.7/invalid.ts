import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "~/rules/prefer-tacit";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // Instantiation Expression
  {
    code: dedent`
      function f<T>(x: T): T {}
      const foo = x => f<number>(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 2,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
      },
    ],
  },
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
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
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
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              export default f<number>
            `,
          },
        ],
      },
    ],
  },
];

export default tests;
