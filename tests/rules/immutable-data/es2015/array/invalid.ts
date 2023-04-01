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
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] *= 2;
      y[0].z[0] *= 2;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] **= 2;
      y[0].z[0] **= 2;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] /= 1;
      y[0].z[0] /= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] %= 1;
      y[0].z[0] %= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] <<= 1;
      y[0].z[0] <<= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] >>= 1;
      y[0].z[0] >>= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] >>>= 1;
      y[0].z[0] >>>= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] &= 1;
      y[0].z[0] &= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] |= 1;
      y[0].z[0] |= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] ^= 1;
      y[0].z[0] ^= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
    ],
  },
];

export default tests;
