import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      (() => {
        console.log("hello world");
      })();`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo([bar, ...baz]) {
        console.log(bar, baz);
      }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      function foo(...bar) {
        console.log(bar);
      }`,
    optionsSet: [[{ ignorePattern: "^foo" }]],
  },
];

export default tests;
