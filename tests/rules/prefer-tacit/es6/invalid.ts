import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: InvalidTestCase[] = [
  {
    code: `const foo = x => f(x);`,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "generic",
        type: "ArrowFunctionExpression",
        line: 1,
        column: 13,
        suggestions: [
          {
            output: dedent`
              const foo = f;
            `,
          },
        ],
      },
    ],
  },
];

export default tests;
