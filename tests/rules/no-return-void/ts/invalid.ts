import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-return-void";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // Disallow void.
  {
    code: dedent`
      function foo(bar: number): void {
        console.log(bar);
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow undefined.
  {
    code: dedent`
      function foo(bar: number): undefined {
        console.log(bar);
        return undefined;
      }
    `,
    optionsSet: [[{ allowUndefined: false }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow null.
  {
    code: dedent`
      function foo(bar: number): null {
        console.log(bar);
        return null;
      }
    `,
    optionsSet: [[{ allowNull: false }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 26,
      },
    ],
  },
  // Disallow higher-order function void.
  {
    code: dedent`
      function foo(bar: number): (baz: number) => void {
        return baz => { console.log(bar, baz); }
      }
    `,
    optionsSet: [[{ ignoreInferredTypes: true }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.TSTypeAnnotation,
        line: 1,
        column: 42,
      },
    ],
  },
  // Disallow implicit return type.
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }
    `,
    optionsSet: [
      [{ ignoreInferredTypes: false }],
      [{ ignoreInferredTypes: false, allowNull: false }],
      [{ ignoreInferredTypes: false, allowUndefined: false }],
    ],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.FunctionDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
];

export default tests;
