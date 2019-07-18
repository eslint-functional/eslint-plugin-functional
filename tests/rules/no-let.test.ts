/**
 * @fileoverview Tests for no-let
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-let";

import { es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function foo() {
        let x;
        let y = 0;
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      const foo = () => {
        let x;
        let y = 0;
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let x;
          let y = 0;
        }
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      let mutable;
      let mutableX`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      let mutable = 0;
      let mutableX = 0`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: `for (let mutableX = 0; x < 1; x++);`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: `for (let mutableX in {});`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: `for (let mutableX of []);`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      function foo() {
        let mutableX;
        let mutableY = 0;
      }`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      const foo = () => {
        let mutableX;
        let mutableY = 0;
      }`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let mutableX;
          let mutableY = 0;
        }
      }`,
    optionsSet: [[{ ignorePattern: "^mutable" }]]
  },
  {
    code: dedent`
      let Mutable;
      let xMutable`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      let Mutable = 0;
      let xMutable = 0`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: `for (let xMutable = 0; x < 1; x++);`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: `for (let xMutable in {});`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: `for (let xMutable of []);`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      function foo() {
        let xMutable;
        let yMutable = 0;
      }`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      const foo = () => {
        let xMutable;
        let yMutable = 0;
      }`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let xMutable;
          let yMutable = 0;
        }
      }`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `let x;`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `let x = 0;`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (let x = 0; x < 1; x++);`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x = 0, y = 0; x < 1; x++);`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x in {});`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x of []);`,
    optionsSet: [[], [{ ignoreLocal: true }], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: dedent`
      function foo() {
        let x;
        let y = 0;
      }`,
    optionsSet: [[], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      const foo = () => {
        let x;
        let y = 0;
      }`,
    optionsSet: [[], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let x;
          let y = 0;
        }
      }`,
    optionsSet: [[], [{ ignorePattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 4,
        column: 5
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
