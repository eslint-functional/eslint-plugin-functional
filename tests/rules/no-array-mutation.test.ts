/**
 * @fileoverview Tests for no-array-mutation
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-array-mutation";

import { typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  // Allowed non-array mutation patterns.
  {
    code: dedent`
      const foo = () => {};
      const bar = {
        x: 1,
        y: foo
      };
      let x = 0;
      x = 4;
      x += 1;
      x -= 1;
      x *= 1;
      x **= 1;
      x /= 1;
      x %= 1;
      x <<= 1;
      x >>= 1;
      x >>>= 1;
      x &= 1;
      x |= 1;
      x ^= 1;
      delete x;
      x++;
      x--;
      ++x;
      --x;
      if (x = 2) {}
      if (x++) {}
      bar.x = 2;
      bar.x++;
      --bar.x;
      delete bar.x`,
    optionsSet: [[]]
  },
  // Allow array non-mutation methods
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];

      x.concat([3, 4]);
      x.includes(2);
      x.indexOf(1);
      x.join(', ');
      x.lastIndexOf(0);
      x.slice(1, 2);
      x.toString();
      x.toLocaleString("en", {timeZone: "UTC"});

      y[0].z.concat([3, 4]);
      y[0].z.includes(2);
      y[0].z.indexOf(1);
      y[0].z.join(', ');
      y[0].z.lastIndexOf(0);
      y[0].z.slice(1, 2);
      y[0].z.toString();
      y[0].z.toLocaleString("en", {timeZone: "UTC"});`,
    optionsSet: [[]]
  },
  // Allowed array mutation methods to be chained to the creation of an array.
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

    new Array(5).copyWithin(0, 1, 2);
    new Array(5).fill(3);
    new Array(5).pop();
    new Array(5).push(3);
    new Array(5).reverse();
    new Array(5).shift();
    new Array(5).sort();
    new Array(5).splice(0, 1, 9);
    new Array(5).unshift(6);`,
    optionsSet: [[]]
  },
  // Allowed array mutation methods to be chained to array constructor functions.
  {
    code: dedent`
    Array.of(0, 1, 2).copyWithin(0, 1, 2);
    Array.of(0, 1, 2).fill(3);
    Array.of(0, 1, 2).pop();
    Array.of(0, 1, 2).push(3);
    Array.of(0, 1, 2).reverse();
    Array.of(0, 1, 2).shift();
    Array.of(0, 1, 2).sort();
    Array.of(0, 1, 2).splice(0, 1, 9);
    Array.of(0, 1, 2).unshift(6);

    Array.from({ length: 10 }).copyWithin(0, 1, 2);
    Array.from({ length: 10 }).fill(3);
    Array.from({ length: 10 }).pop();
    Array.from({ length: 10 }).push(3);
    Array.from({ length: 10 }).reverse();
    Array.from({ length: 10 }).shift();
    Array.from({ length: 10 }).sort();
    Array.from({ length: 10 }).splice(0, 1, 9);
    Array.from({ length: 10 }).unshift(6);`,
    optionsSet: [[]]
  },
  // Allowed array mutation methods to be chained to array accessor/iteration methods.
  {
    code: dedent`
    x.slice().copyWithin(0, 1, 2);
    x.slice().fill(3);
    x.slice().pop();
    x.slice().push(3);
    x.slice().reverse();
    x.slice().shift();
    x.slice().sort();
    x.slice().splice(0, 1, 9);
    x.slice().unshift(6);

    x.concat([1, 2, 3]).copyWithin(0, 1, 2);
    x.concat([1, 2, 3]).fill(3);
    x.concat([1, 2, 3]).pop();
    x.concat([1, 2, 3]).push(3);
    x.concat([1, 2, 3]).reverse();
    x.concat([1, 2, 3]).shift();
    x.concat([1, 2, 3]).sort();
    x.concat([1, 2, 3]).splice(0, 1, 9);
    x.concat([1, 2, 3]).unshift(6);

    x.filter(v => v > 1).copyWithin(0, 1, 2);
    x.filter(v => v > 1).fill(3);
    x.filter(v => v > 1).pop();
    x.filter(v => v > 1).push(3);
    x.filter(v => v > 1).reverse();
    x.filter(v => v > 1).shift();
    x.filter(v => v > 1).sort();
    x.filter(v => v > 1).splice(0, 1, 9);
    x.filter(v => v > 1).unshift(6);

    x.map(v => v * 2).copyWithin(0, 1, 2);
    x.map(v => v * 2).fill(3);
    x.map(v => v * 2).pop();
    x.map(v => v * 2).push(3);
    x.map(v => v * 2).reverse();
    x.map(v => v * 2).shift();
    x.map(v => v * 2).sort();
    x.map(v => v * 2).splice(0, 1, 9);
    x.map(v => v * 2).unshift(6);

    x.reduce((r, v) => [...r, v + 1], []).copyWithin(0, 1, 2);
    x.reduce((r, v) => [...r, v + 1], []).fill(3);
    x.reduce((r, v) => [...r, v + 1], []).pop();
    x.reduce((r, v) => [...r, v + 1], []).push(3);
    x.reduce((r, v) => [...r, v + 1], []).reverse();
    x.reduce((r, v) => [...r, v + 1], []).shift();
    x.reduce((r, v) => [...r, v + 1], []).sort();
    x.reduce((r, v) => [...r, v + 1], []).splice(0, 1, 9);
    x.reduce((r, v) => [...r, v + 1], []).unshift(6);

    x.reduceRight((r, v) => [...r, v + 1], []).copyWithin(0, 1, 2);
    x.reduceRight((r, v) => [...r, v + 1], []).fill(3);
    x.reduceRight((r, v) => [...r, v + 1], []).pop();
    x.reduceRight((r, v) => [...r, v + 1], []).push(3);
    x.reduceRight((r, v) => [...r, v + 1], []).reverse();
    x.reduceRight((r, v) => [...r, v + 1], []).shift();
    x.reduceRight((r, v) => [...r, v + 1], []).sort();
    x.reduceRight((r, v) => [...r, v + 1], []).splice(0, 1, 9);
    x.reduceRight((r, v) => [...r, v + 1], []).unshift(6);`,
    optionsSet: [[]]
  },
  // Don't catch calls of array mutation methods on non-array objects.
  {
    code: dedent`
      const z = {
        length: 5,
        copyWithin: () => {},
        fill: () => {},
        pop: () => {},
        push: () => {},
        reverse: () => {},
        shift: () => {},
        sort: () => {},
        splice: () => {},
        unshift: () => {}
      };

      z.length = 7;
      z.copyWithin();
      z.fill();
      z.pop();
      z.push();
      z.reverse();
      z.shift();
      z.sort();
      z.splice();
      z.unshift();`,
    optionsSet: [[{ ignoreNewArray: false }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] = 4;
      y[0].z[0] = 4;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] += 1;
      y[0].z[0] += 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0] -= 1;
      y[0].z[0] -= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
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
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      delete x[0];
      delete y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UnaryExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0]++;
      y[0].z[0]++;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x[0]--;
      y[0].z[0]--;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      ++x[0];
      ++y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      --x[0];
      --y[0].z[0];
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 1
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      if (x[0] = 2) {}
      if (y[0].z[0] = 2) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 5
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      if (x[0]++) {}
      if (y[0].z[0]++) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "UpdateExpression",
        line: 4,
        column: 5
      }
    ]
  },
  {
    code: dedent`
      const x = [5, 6];
      const y = [{ z: [3, 7] }];
      x.length = 5;
      y[0].z.length = 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "AssignmentExpression",
        line: 4,
        column: 1
      }
    ]
  },
  // Disallowed array mutation methods.
  {
    code: dedent`
      const x = [5, 6];
      x.copyWithin(0, 1, 2);
      x.fill(3);
      x.pop();
      x.push(3);
      x.reverse();
      x.shift();
      x.sort();
      x.splice(0, 1, 9);
      x.unshift(6);
      const y = [{ z: [3, 7] }];
      y[0].z.copyWithin(0, 1, 2);
      y[0].z.fill(3);
      y[0].z.pop();
      y[0].z.push(3);
      y[0].z.reverse();
      y[0].z.shift();
      y[0].z.sort();
      y[0].z.splice(0, 1, 9);
      y[0].z.unshift(6);`,
    optionsSet: [[{ ignoreNewArray: false }]],
    errors: [
      {
        messageId: "generic",
        type: "CallExpression",
        line: 2,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 3,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 4,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 5,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 6,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 7,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 8,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 9,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 10,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 12,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 13,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 14,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 15,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 16,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 17,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 18,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 19,
        column: 1
      },
      {
        messageId: "generic",
        type: "CallExpression",
        line: 20,
        column: 1
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, (rule as unknown) as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
