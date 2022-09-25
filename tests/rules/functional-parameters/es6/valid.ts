import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      (() => {
        console.log("hello world");
      })();
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo([bar, ...baz]) {
        console.log(bar, baz);
      }
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo(...bar) {
        console.log(bar);
      }
    `,
    optionsSet: [[{ ignorePattern: "^foo" }]],
  },
  {
    code: dedent`
      const baz = {
        foo(...bar) {
          console.log(bar);
        }
      }
    `,
    optionsSet: [[{ ignorePattern: "^foo" }]],
  },
  {
    code: dedent`
      [1, 2, 3].reduce(
        (carry, current) => carry + current,
        0
      );
    `,
    optionsSet: [
      [
        {
          enforceParameterCount: "exactlyOne",
          ignorePrefixSelector: "CallExpression[callee.property.name='reduce']",
        },
      ],
    ],
  },
  {
    code: dedent`
      [1, 2, 3].map(
        (element, index) => element + index,
        0
      );
    `,
    optionsSet: [
      [
        {
          enforceParameterCount: "exactlyOne",
          ignorePrefixSelector: "CallExpression[callee.property.name='map']",
        },
      ],
    ],
  },
  {
    code: dedent`
      [1, 2, 3]
        .map(
          (element, index) => element + index
        )
        .reduce(
          (carry, current) => carry + current, 0
        );
    `,
    optionsSet: [
      [
        {
          enforceParameterCount: "exactlyOne",
          ignorePrefixSelector: [
            "CallExpression[callee.property.name='reduce']",
            "CallExpression[callee.property.name='map']",
          ],
        },
      ],
    ],
  },
  {
    code: dedent`
      function foo(param) {}
      foo(() => 1);
    `,
    optionsSet: [[{ enforceParameterCount: { ignoreLambdaExpression: true } }]],
  },
];

export default tests;
