import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-let";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: dedent`
      function foo() {
        let x;
        let y = 0;
      }
    `,
    optionsSet: [[{ allowInFunctions: true }]],
  },
  {
    code: dedent`
      const foo = () => {
        let x;
        let y = 0;
      }
    `,
    optionsSet: [[{ allowInFunctions: true }]],
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let x;
          let y = 0;
        }
      }
    `,
    optionsSet: [[{ allowInFunctions: true }]],
  },
  {
    code: dedent`
      let mutable;
      let mutableX
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      let mutable = 0;
      let mutableX = 0
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: `for (let mutableX = 0; x < 1; x++);`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: `for (let mutableX in {});`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: `for (let mutableX of []);`,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      function foo() {
        let mutableX;
        let mutableY = 0;
      }
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      const foo = () => {
        let mutableX;
        let mutableY = 0;
      }
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let mutableX;
          let mutableY = 0;
        }
      }
    `,
    optionsSet: [[{ ignorePattern: "^mutable" }]],
  },
  {
    code: dedent`
      let Mutable;
      let xMutable
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      let Mutable = 0;
      let xMutable = 0
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: `for (let xMutable = 0; x < 1; x++);`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: `for (let xMutable in {});`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: `for (let xMutable of []);`,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      function foo() {
        let xMutable;
        let yMutable = 0;
      }
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      const foo = () => {
        let xMutable;
        let yMutable = 0;
      }
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let xMutable;
          let yMutable = 0;
        }
      }
    `,
    optionsSet: [[{ ignorePattern: "Mutable$" }]],
  },
  {
    code: `for (let x = 0; x < 1; x++);`,
    optionsSet: [[{ allowInForLoopInit: true }]],
  },
];

export default tests;
