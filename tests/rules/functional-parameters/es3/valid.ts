import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/functional-parameters";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      var foo = {
        arguments: 2
      };
      foo.arguments = 3
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      (function() {
        console.log("hello world");
      })();
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }
    `,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ enforceParameterCount: "exactlyOne" }],
    ],
  },
  {
    code: dedent`
      function foo(bar, baz) {
        console.log(bar, baz);
      }
    `,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ ignorePattern: "^foo", enforceParameterCount: "exactlyOne" }],
    ],
  },
  {
    code: dedent`
      [1, 2, 3].reduce(
        function(carry, current) {
          return carry + current;
        },
        0
      );
    `,
    optionsSet: [
      [
        {
          ignorePrefixSelector: "CallExpression[callee.property.name='reduce']",
          enforceParameterCount: "exactlyOne",
        },
      ],
    ],
  },
  {
    code: dedent`
      [1, 2, 3].map(
        function(element, index) {
          return element + index;
        },
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
      foo(function () {});
    `,
    optionsSet: [[{ enforceParameterCount: { ignoreLambdaExpression: true } }]],
  },
];

export default tests;
