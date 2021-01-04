import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: `let x;`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `let x = 0;`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `for (let x = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x = 0, y = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x in {});`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x of []);`,
    optionsSet: [
      [],
      [{ allowLocalMutation: true }],
      [{ ignorePattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6,
      },
    ],
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
        column: 3,
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3,
      },
    ],
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
        column: 3,
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3,
      },
    ],
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
        column: 5,
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 4,
        column: 5,
      },
    ],
  },
];

export default tests;
