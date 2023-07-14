import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { type rule } from "~/rules/no-classes";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  {
    code: "class Foo {}",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ClassDeclaration,
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: "const klass = class {}",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.ClassExpression,
        line: 1,
        column: 15,
      },
    ],
  },
];

export default tests;
