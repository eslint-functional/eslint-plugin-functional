import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { type rule } from "~/rules/no-loop-statements";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `for (var x = 0; x < 10; x++) { console.log(x); }`,
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
    code: `for (var x in y) { console.log(x); }`,
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
    code: `while (true) { console.log("a"); }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.WhileStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `do { console.log("a"); } while (true)`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.DoWhileStatement,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
