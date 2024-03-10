import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-expression-statements";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Defining variable should still be allowed.
  {
    code: `var x = [];`,
    optionsSet: [[]],
  },
  // Allowed expressions should not cause failures.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");
    `,
    optionsSet: [[{ ignoreCodePattern: "^console\\." }]],
  },
  {
    code: dedent`
      assert(1 !== 2);
    `,
    optionsSet: [[{ ignoreCodePattern: "^assert" }]],
  },
  // Allow specifying directive prologues.
  {
    code: `"use strict"`,
    optionsSet: [[]],
  },
  // Allow yield.
  {
    code: dedent`
      export function* foo() {
        yield "hello";
        return "world";
      }
    `,
    optionsSet: [[]],
  },
  // Allowed ignoring void expressions.
  {
    code: dedent`
      console.log("yo");
      console.error("yo");
    `,
    optionsSet: [[{ ignoreVoid: true }]],
  },
  // Allowed ignoring self returning expressions.
  {
    code: dedent`
      function foo() { return this; }
      foo();
    `,
    optionsSet: [[{ ignoreSelfReturning: true }]],
  },
  {
    code: dedent`
      const foo = { bar() { return this; }};
      foo.bar();
    `,
    optionsSet: [[{ ignoreSelfReturning: true }]],
  },
  {
    code: dedent`
      class Foo { bar() { return this; }};
      const foo = new Foo();
      foo.bar();
    `,
    optionsSet: [[{ ignoreSelfReturning: true }]],
  },
];

export default tests;
