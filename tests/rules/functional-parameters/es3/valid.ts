import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
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
];

export default tests;
