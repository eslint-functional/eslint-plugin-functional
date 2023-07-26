import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/prefer-tacit";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // FunctionDeclaration.
  {
    code: dedent`
      function f(x) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 2,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f(x) {}
      function foo(x) { return f(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 1,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f(x) {}
      export default function (x) { return f(x); }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 16,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f(x) {}
              export default f
            `,
          },
        ],
      },
    ],
  },
  // FunctionExpression.
  {
    code: dedent`
      const f = function(x) {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 2,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              const f = function(x) {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  // ArrowFunction.
  {
    code: dedent`
      const f = x => {}
      const foo = x => f(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 2,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              const f = x => {}
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  // TypeAlias.
  {
    code: dedent`
      type F = (x) => {};
      const f = undefined as unknown as F;
      const foo = x => f(x);
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 3,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              type F = (x) => {};
              const f = undefined as unknown as F;
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
  // Instantiation Expression
  {
    code: dedent`
      function f<T>(x: T): T {}
      const foo = x => f<number>(x);
    `,
    dependencyConstraints: {
      typescript: "4.7.0",
    },
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 2,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      function foo(x) { return f<number>(x); }
    `,
    dependencyConstraints: {
      typescript: "4.7.0",
    },
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 1,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              const foo = f<number>;
            `,
          },
        ],
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      export default function (x) { return f<number>(x); }
    `,
    dependencyConstraints: {
      typescript: "4.7.0",
    },
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 16,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              function f<T>(x: T): T {}
              export default f<number>
            `,
          },
        ],
      },
    ],
  },
  // Instantiation Expression not supported.
  {
    code: dedent`
      function f<T>(x: T): T {}
      function foo(x) { return f<number>(x); }
    `,
    dependencyConstraints: {
      typescript: {
        range: "<4.7.0",
      },
    },
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      function f<T>(x: T): T {}
      export default function (x) { return f<number>(x); }
    `,
    dependencyConstraints: {
      typescript: {
        range: "<4.7.0",
      },
    },
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 2,
        column: 16,
      },
    ],
  },
];

export default tests;
