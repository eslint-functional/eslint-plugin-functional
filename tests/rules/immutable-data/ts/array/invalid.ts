import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#/rules/immutable-data";
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
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] = 4;
      y[0].z[0] = 4;
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
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] += 1;
      y[0].z[0] += 1;
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
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0] -= 1;
      y[0].z[0] -= 1;
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
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      delete x[0];
      delete y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UnaryExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UnaryExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0]++;
      y[0].z[0]++;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x[0]--;
      y[0].z[0]--;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      ++x[0];
      ++y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      --x[0];
      --y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      if (x[0] = 2) {}
      if (y[0].z[0] = 2) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      if (x[0]++) {}
      if (y[0].z[0]++) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 4,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      var x = [5, 6];
      var y = [{ z: [3, 7] }];
      x.length = 5;
      y[0].z.length = 1;
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
  // Disallowed array mutation methods.
  {
    code: dedent`
      var x = [5, 6];
      x.copyWithin(0, 1, 2);
      x.fill(3);
      x.pop();
      x.push(3);
      x.reverse();
      x.shift();
      x.sort();
      x.splice(0, 1, 9);
      x.unshift(6);
      var y = [{ z: [3, 7] }];
      y[0].z.copyWithin(0, 1, 2);
      y[0].z.fill(3);
      y[0].z.pop();
      y[0].z.push(3);
      y[0].z.reverse();
      y[0].z.shift();
      y[0].z.sort();
      y[0].z.splice(0, 1, 9);
      y[0].z.unshift(6);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 2,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 4,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 5,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 6,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 7,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 8,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 9,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 10,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 12,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 13,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 14,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 15,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 16,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 17,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 18,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 19,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 20,
        column: 1,
      },
    ],
  },
  // Disallowed array mutation methods to be chained to the creation of an array
  // if `ignoreImmediateMutation` is false.
  {
    code: dedent`
      [0, 1, 2].copyWithin(0, 1, 2);
      [0, 1, 2].fill(3);
      [0, 1, 2].pop();
      [0, 1, 2].push(3);
      [0, 1, 2].reverse();
      [0, 1, 2].shift();
      [0, 1, 2].sort();
      [0, 1, 2].splice(0, 1, 9);
      [0, 1, 2].unshift(6);
    `,
    optionsSet: [[{ ignoreImmediateMutation: false }]],
    errors: [
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 1,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 2,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 4,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 5,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 6,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 7,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 8,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 9,
        column: 1,
      },
    ],
  },
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
  // ignoreNonConstDeclarations.
  {
    code: dedent`
      const arr = [0, 1];
      arr[0] += 1;
      arr[1]++;
      delete arr[0];
      arr.copyWithin(0, 1, 2);
      arr.fill(3);
      arr.pop();
      arr.push(3);
      arr.reverse();
      arr.shift();
      arr.sort();
      arr.splice(0, 1, 9);
      arr.unshift(6);
    `,
    optionsSet: [[{ ignoreNonConstDeclarations: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 2,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UnaryExpression,
        line: 4,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 5,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 6,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 7,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 8,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 9,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 10,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 11,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 12,
        column: 1,
      },
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 13,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      (mutable_foo as string[]).sort();
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "array",
        type: AST_NODE_TYPES.CallExpression,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
