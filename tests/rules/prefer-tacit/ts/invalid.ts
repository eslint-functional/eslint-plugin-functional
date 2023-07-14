import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "~/rules/prefer-tacit";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // {
  //   code: "var foo = function(x) { f(x); }",
  //   optionsSet: [[{ assumeTypes: true }]],
  //   errors: [
  //     {
  //       messageId: "generic",
  //       type: "ArrowFunctionExpression",
  //       line: 1,
  //       column: 13,
  //       suggestions: [
  //         {
  //           output: dedent`
  //             var foo = f;
  //           `,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    code: `const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ArrowFunctionExpression,
        line: 1,
        column: 13,
        suggestions: [
          {
            messageId: "generic",
            output: dedent`
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
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
];

export default tests;
