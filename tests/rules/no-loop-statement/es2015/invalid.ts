import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { rule } from "#/rules/no-loop-statements";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `for (const x = 0; x < 10; x++) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ForStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `for (const x in y) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ForInStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `for (const x of y) { console.log(x); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ForOfStatement,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
