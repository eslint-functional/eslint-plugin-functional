import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { type rule } from "#eslint-plugin-functional/rules/no-this-expressions";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `this.x = 0;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThisExpression,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
