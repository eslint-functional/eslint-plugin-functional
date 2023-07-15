import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/functional-parameters";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: dedent`
      function foo() {
        console.log("hello world");
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      (function() {
        console.log("hello world");
      })();
    `,
    optionsSet: [[{ enforceParameterCount: { ignoreIIFE: false } }]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: AST_NODE_TYPES.FunctionExpression,
        line: 1,
        column: 2,
      },
    ],
  },
  {
    code: dedent`
      function foo(bar) {
        console.log(arguments);
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "arguments",
        type: AST_NODE_TYPES.Identifier,
        line: 2,
        column: 15,
      },
    ],
  },
  {
    code: dedent`
      function foo() {
        console.log("bar");
      }
    `,
    optionsSet: [[{ enforceParameterCount: "atLeastOne" }]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      function foo() {
        console.log("bar");
      }
    `,
    optionsSet: [[{ enforceParameterCount: "exactlyOne" }]],
    errors: [
      {
        messageId: "paramCountExactlyOne",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      function foo(bar, baz) {
        console.log(bar, baz);
      }
    `,
    optionsSet: [[{ enforceParameterCount: "exactlyOne" }]],
    errors: [
      {
        messageId: "paramCountExactlyOne",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      [1, 2, 3]
        .map(
          function(element, index) {
            return element + index;
          }
        )
        .reduce(
          function(carry, current) {
            return carry + current;
          },
          0
        );
    `,
    optionsSet: [[{ enforceParameterCount: "exactlyOne" }]],
    errors: [
      {
        messageId: "paramCountExactlyOne",
        type: AST_NODE_TYPES.FunctionExpression,
        line: 3,
        column: 5,
      },
      {
        messageId: "paramCountExactlyOne",
        type: AST_NODE_TYPES.FunctionExpression,
        line: 8,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      function foo(param) {}
      foo(function () {});
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "paramCountAtLeastOne",
        type: AST_NODE_TYPES.FunctionExpression,
        line: 2,
        column: 5,
      },
    ],
  },
];

export default tests;
