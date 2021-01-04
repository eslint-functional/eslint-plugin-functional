import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      var foo = {
        arguments: 2
      };
      foo.arguments = 3`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      (function() {
        console.log("hello world");
      })();`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo(bar) {
        console.log(bar);
      }`,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ enforceParameterCount: "exactlyOne" }],
    ],
  },
  {
    code: dedent`
      function foo(bar, baz) {
        console.log(bar, baz);
      }`,
    optionsSet: [
      [{ enforceParameterCount: "atLeastOne" }],
      [{ ignorePattern: "^foo", enforceParameterCount: "exactlyOne" }],
    ],
  },
];

export default tests;
