import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { type rule } from "#eslint-plugin-functional/rules/no-try-statements";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: AST_NODE_TYPES.TryStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "catch",
        type: AST_NODE_TYPES.TryStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowCatch: true }]],
    errors: [
      {
        messageId: "finally",
        type: AST_NODE_TYPES.TryStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} catch (e) {} finally {}`,
    optionsSet: [[{ allowFinally: true }]],
    errors: [
      {
        messageId: "catch",
        type: AST_NODE_TYPES.TryStatement,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "finally",
        type: AST_NODE_TYPES.TryStatement,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
