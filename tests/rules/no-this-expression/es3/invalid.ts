import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { rule } from "~/rules/no-this-expressions";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "~/tests/helpers/util";

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
