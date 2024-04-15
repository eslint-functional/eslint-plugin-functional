import dedent from "dedent";

import { type rule } from "#/rules/functional-parameters";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
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
    optionsSet: [[{ ignoreIdentifierPattern: "^foo" }]],
  },
  {
    code: dedent`
      const baz = {
        foo(...bar) {
          console.log(bar);
        }
      }
    `,
    optionsSet: [[{ ignoreIdentifierPattern: "^foo" }]],
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
  {
    code: dedent`
      const foo = {
        get bar() {
          return "baz";
        }
      }
    `,
    optionsSet: [[{ enforceParameterCount: {} }]],
  },
];

export default tests;
