/**
 * @fileoverview Tests for no-let
 */

import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { name, rule } from "../../src/rules/noLet";

import { es6, typescript } from "../configs";
import {
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function foo() {
        let x;
        let y = 0;
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      const foo = () => {
        let x;
        let y = 0;
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let x;
          let y = 0;
        }
      }`,
    optionsSet: [[{ ignoreLocal: true }]]
  },
  {
    code: dedent`
      let mutable;
      let mutableX`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: dedent`
      let mutable = 0;
      let mutableX = 0`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: `for (let mutableX = 0; x < 1; x++);`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: `for (let mutableX in {});`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: `for (let mutableX of []);`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: dedent`
      function foo() {
        let mutableX;
        let mutableY = 0;
      }`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: dedent`
      const foo = () => {
        let mutableX;
        let mutableY = 0;
      }`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let mutableX;
          let mutableY = 0;
        }
      }`,
    optionsSet: [[{ ignorePrefix: "mutable" }], [{ ignorePattern: "mutable*" }]]
  },
  {
    code: dedent`
      let Mutable;
      let xMutable`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: dedent`
      let Mutable = 0;
      let xMutable = 0`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: `for (let xMutable = 0; x < 1; x++);`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: `for (let xMutable in {});`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: `for (let xMutable of []);`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: dedent`
      function foo() {
        let xMutable;
        let yMutable = 0;
      }`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: dedent`
      const foo = () => {
        let xMutable;
        let yMutable = 0;
      }`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let xMutable;
          let yMutable = 0;
        }
      }`,
    optionsSet: [[{ ignoreSuffix: "Mutable" }], [{ ignorePattern: "*Mutable" }]]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `let x;`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `let x = 0;`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: `const x = 0;`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 1
      }
    ]
  },
  {
    code: `for (let x = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: `for (const x = 0; x < 1; x++);`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x = 0, y = 0; x < 1; x++);`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: `for (const x = 0, y = 0; x < 1; x++);`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x in {});`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: `for (const x in {});`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: `for (let x of []);`,
    optionsSet: [
      [],
      [{ ignoreLocal: true }],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: `for (const x of []);`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 1,
        column: 6
      }
    ]
  },
  {
    code: dedent`
      function foo() {
        let x;
        let y = 0;
      }`,
    optionsSet: [
      [],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: dedent`
      function foo() {
        let x;
        const y = 0;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      const foo = () => {
        let x;
        let y = 0;
      }`,
    optionsSet: [
      [],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: dedent`
      const foo = () => {
        let x;
        const y = 0;
      }`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 2,
        column: 3
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 3
      }
    ]
  },
  {
    code: dedent`
      class Foo {
        foo() {
          let x;
          let y = 0;
        }
      }`,
    optionsSet: [
      [],
      [{ ignorePrefix: "mutable" }],
      [{ ignoreSuffix: "Mutable" }],
      [{ ignorePattern: "mutable*" }]
    ],
    output: dedent`
      class Foo {
        foo() {
          let x;
          const y = 0;
        }
      }`,
    errors: [
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 3,
        column: 5
      },
      {
        messageId: "generic",
        type: "VariableDeclaration",
        line: 4,
        column: 5
      }
    ]
  }
];

describe("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es6)", () => {
  const ruleTester = new RuleTester(es6);
  ruleTester.run(name, rule as Rule.RuleModule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
