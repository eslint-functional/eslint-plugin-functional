import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import type { rule } from "#/rules/no-throw-statements";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      async function foo() {
        throw new Error();
      }
    `,
    optionsSet: [
      [
        {
          allowInAsyncFunctions: false,
        },
      ],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      async function foo() {
        function bar() {
          throw new Error();
        }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 3,
        column: 5,
      },
    ],
  },
];

export default tests;
