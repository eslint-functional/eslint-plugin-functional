import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: "class Foo {}",
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ClassDeclaration",
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
        type: "ClassExpression",
        line: 1,
        column: 15,
      },
    ],
  },
];

export default tests;
