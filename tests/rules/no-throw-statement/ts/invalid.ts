import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#/rules/no-throw-statements";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      const foo = Promise.reject();
      foo.then(() => {
        throw new Error();
      });
    `,
    optionsSet: [
      [
        {
          allowToRejectPromises: true,
        },
      ],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 3,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
        const foo = Promise.reject();
        foo.then(
          () => {
            throw new Error();
          },
          () => {}
      );
    `,
    optionsSet: [
      [
        {
          allowToRejectPromises: true,
        },
      ],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 4,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      const foo = {
        catch(cb) {
          cb();
        },
      };
      foo.catch(() => {
        throw new Error();
      });
    `,
    optionsSet: [
      [
        {
          allowToRejectPromises: true,
        },
      ],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ThrowStatement,
        line: 7,
        column: 3,
      },
    ],
  },
];

export default tests;
