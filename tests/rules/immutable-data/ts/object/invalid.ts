import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import type { rule } from "~/rules/immutable-data";
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
      class Klass {
        bar = 1;
        baz: string;

        constructor() {
          this.baz = "hello";
        }

        zoo() {
          this.bar = 2;
          this.baz = 3;
        }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 10,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 11,
        column: 5,
      },
    ],
  },
];

export default tests;
