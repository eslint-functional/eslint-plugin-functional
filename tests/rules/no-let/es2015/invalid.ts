import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import type { rule } from "#/rules/no-let";
import type {
  InvalidTestCaseSet,
  MessagesOf,
  OptionsOf,
} from "#/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: `let x;`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `let x = 0;`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: `for (let x = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x = 0, y = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x in {});`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 1,
        column: 6,
      },
    ],
  },
  {
    code: `for (let x of []);`,
    optionsSet: [
      [],
      [{ allowInFunctions: true }],
      [{ ignoreIdentifierPattern: "^mutable" }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
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
      }
    `,
    optionsSet: [[], [{ ignoreIdentifierPattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 2,
        column: 3,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
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
      }
    `,
    optionsSet: [[], [{ ignoreIdentifierPattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 2,
        column: 3,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
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
      }
    `,
    optionsSet: [[], [{ ignoreIdentifierPattern: "^mutable" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 3,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.VariableDeclaration,
        line: 4,
        column: 5,
      },
    ],
  },
];

export default tests;
