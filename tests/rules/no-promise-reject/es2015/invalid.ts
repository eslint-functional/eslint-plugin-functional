import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-promise-reject";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      function foo() {
        if (Math.random() > 0.5) {
            return Promise.reject(new Error("bar"))
        }
        return Promise.resolve(10)
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.CallExpression,
        line: 3,
        column: 14,
      },
    ],
  },
];

export default tests;
