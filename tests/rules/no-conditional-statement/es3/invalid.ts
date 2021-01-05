import dedent from "dedent";

import type { InvalidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      if (i === 1) {
        x = 2;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "unexpectedIf",
        type: "IfStatement",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      var x = "c";
      var y = "";
      switch(x) {
        case "a":
          y = 1;
          break;
        case "b":
          y = 2;
          break;
        default:
          y = 3;
          break;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "unexpectedSwitch",
        type: "SwitchStatement",
        line: 3,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          return 1;
        }
        return 0;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "unexpectedIf",
        type: "IfStatement",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
          default:
            return 3;
        }
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "unexpectedSwitch",
        type: "SwitchStatement",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          console.log("bar");
        }
        if (i === 2) console.log("baz");
        else return 3;
        return 0;
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
    errors: [
      {
        messageId: "incompleteBranch",
        type: "BlockStatement",
        line: 2,
        column: 16,
      },
      {
        messageId: "incompleteBranch",
        type: "ExpressionStatement",
        line: 5,
        column: 16,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
          default:
            break;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
    errors: [
      {
        messageId: "incompleteBranch",
        type: "SwitchCase",
        line: 7,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      function foo(x, y) {
        if (x > 0) {
          if (y < 100) {
            return 1;
          } else {
            console.log("bar");
          }
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
    errors: [
      {
        messageId: "incompleteBranch",
        type: "BlockStatement",
        line: 5,
        column: 12,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          return 1;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
    errors: [
      {
        messageId: "incompleteIf",
        type: "IfStatement",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          return 1;
        } else {
          console.log(1);
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
    errors: [
      {
        messageId: "incompleteBranch",
        type: "BlockStatement",
        line: 4,
        column: 10,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
    errors: [
      {
        messageId: "incompleteSwitch",
        type: "SwitchStatement",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
          default:
            break;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
    errors: [
      {
        messageId: "incompleteBranch",
        type: "SwitchCase",
        line: 7,
        column: 5,
      },
    ],
  },
];

export default tests;
