import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
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
        type: "AssignmentExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
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
        type: "AssignmentExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
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
        type: "AssignmentExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
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
        type: "UnaryExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
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
        type: "UpdateExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
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
        type: "UpdateExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
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
        type: "UpdateExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
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
        type: "UpdateExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
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
        type: "AssignmentExpression",
        line: 3,
        column: 5,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
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
        type: "UpdateExpression",
        line: 3,
        column: 5,
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
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
        type: "AssignmentExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
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
      y[0].z.unshift(6);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "array",
        type: "CallExpression",
        line: 2,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 4,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 5,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 6,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 7,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 8,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 9,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 10,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 12,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 13,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 14,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 15,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 16,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 17,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 18,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 19,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
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
      [0, 1, 2].unshift(6)`,
    optionsSet: [[{ ignoreImmediateMutation: false }]],
    errors: [
      {
        messageId: "array",
        type: "CallExpression",
        line: 1,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 2,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 3,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 4,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 5,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 6,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 7,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 8,
        column: 1,
      },
      {
        messageId: "array",
        type: "CallExpression",
        line: 9,
        column: 1,
      },
    ],
  },
];

export default tests;
