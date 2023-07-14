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
  {
    code: `const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 1,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
];

export default tests;
