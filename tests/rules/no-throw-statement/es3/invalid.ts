import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#/rules/no-throw-statements";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `throw 'error';`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `throw new Error();`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var error = new Error();
      throw error;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        line: 2,
        column: 1,
      },
    ],
  },
];

export default tests;
