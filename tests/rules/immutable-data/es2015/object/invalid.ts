import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "~/rules/immutable-data";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      const x = {a: 1};
      x.a **= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 2,
        column: 1,
      },
    ],
  },
  // No mutation in class methods.
  {
    code: dedent`
      class Klass {
        bar = 1;

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
        line: 9,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 10,
        column: 5,
      },
    ],
  },
  // Catch non-field mutation in classes.
  {
    code: dedent`
      class Klass {
        mutate() {
          let data = { prop: 0 };
          data.prop = 1;
        }
      }
    `,
    optionsSet: [[{ ignoreClasses: "fieldsOnly" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 5,
      },
    ],
  },
];

export default tests;
