import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/functional-parameters";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      function foo(...bar: string[]) {
        console.log(bar);
      }
    `,
    optionsSet: [
      [
        {
          allowRestParameter: false,
          overrides: [
            {
              specifiers: {
                from: "file",
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
                from: "file",
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
    optionsSet: [
      [
        {
          allowArgumentsKeyword: false,
          overrides: [
            {
              specifiers: {
                from: "file",
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
                from: "file",
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
