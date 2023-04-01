import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import type { rule } from "~/rules/no-expression-statements";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      var x = [];
      x.push(1);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ExpressionStatement,
        line: 2,
        column: 1,
      },
    ],
  },
  // Non-allowed expressions should cause failures.
  {
    code: `console.trace();`,
    optionsSet: [[{ ignorePattern: "^console\\.log" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ExpressionStatement,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
