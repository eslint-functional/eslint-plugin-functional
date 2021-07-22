/**
 * @file Tests for prefer-tacit.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/prefer-tacit";
import { es6, typescript } from "../helpers/configs";
import type { InvalidTestCase, ValidTestCase } from "../helpers/util";
import {
  describeTsOnly,
  processInvalidTestCase,
  processValidTestCase,
} from "../helpers/util";

// Valid test cases.
const es6Valid: ReadonlyArray<ValidTestCase> = [
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: `const foo = x => f(x);`,
    optionsSet: [[]],
  },
];

// Valid test cases.
const tsValid: ReadonlyArray<ValidTestCase> = [
  ...es6Valid,
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x, y) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x, y) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = (x, y) => {}
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x, y) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);`,
    optionsSet: [[]],
  },
];

// Valid test cases.
const es6Invalid: ReadonlyArray<InvalidTestCase> = [
  {
    // No typedef but assuming types.
    // No fixer.
    code: `const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: { allowFixer: false } }]],
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 1,
        column: 13,
      },
    ],
  },
  {
    // No typedef but assuming types.
    // With fixer.
    code: `const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: { allowFixer: true } }]],
    output: dedent`
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 1,
        column: 13,
      },
    ],
  },
  // Default parameters.
  {
    code: dedent`
      function f(x, y = 10) {}
      const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: { allowFixer: true } }]],
    output: dedent`
      function f(x, y = 10) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
];

// Invalid test cases.
const tsInvalid: ReadonlyArray<InvalidTestCase> = [
  ...es6Invalid,
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      function f(x) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      const f = function(x) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = x => {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      const f = x => {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 3,
        column: 13,
      },
    ],
  },
  // Optional parameters.
  {
    code: dedent`
      function f(x: number, y?: number) {}
      const foo = x => f(x);`,
    optionsSet: [[]],
    output: dedent`
      function f(x: number, y?: number) {}
      const foo = f;`,
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 2,
        column: 13,
      },
    ],
  },
];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(tsValid),
    invalid: processInvalidTestCase(tsInvalid),
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(es6Valid),
    invalid: processInvalidTestCase(es6Invalid),
  });
});
