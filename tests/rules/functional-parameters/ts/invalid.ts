import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/functional-parameters";
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
      function foo(...bar: string[]) {
        console.log(bar);
      }
    `,
    errors: [
      {
        messageId: "restParam",
        type: AST_NODE_TYPES.RestElement,
        line: 1,
        column: 14,
      },
    ],
    optionsSet: [
      [
        {
          allowRestParameter: false,
          overrides: [
            {
              specifiers: {
                from: "lib",
              },
              disable: true,
            },
          ],
        },
      ],
      [
        {
          allowRestParameter: false,
          overrides: [
            {
              specifiers: {
                from: "lib",
              },
              options: {
                allowRestParameter: true,
              },
            },
          ],
        },
      ],
    ],
  },
  {
    code: dedent`
      function foo(bar: string[]) {
        console.log(arguments);
      }
    `,
    errors: [
      {
        messageId: "arguments",
        type: AST_NODE_TYPES.Identifier,
        line: 2,
        column: 15,
      },
    ],
    optionsSet: [
      [
        {
          allowArgumentsKeyword: false,
          overrides: [
            {
              specifiers: {
                from: "lib",
              },
              disable: true,
            },
          ],
        },
      ],
      [
        {
          allowArgumentsKeyword: false,
          overrides: [
            {
              specifiers: {
                from: "lib",
              },
              options: {
                allowArgumentsKeyword: true,
              },
            },
          ],
        },
      ],
    ],
  },
];

export default tests;
