/**
 * @file Tests for no-conditional-statement.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-conditional-statement";

import { es3, typescript } from "../helpers/configs";
import {
  describeTsOnly,
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          return 1;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]]
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          return 1;
        } else {
          return 0;
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }]
    ]
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            return 1;
          case "b":
          case "c":
            return 2;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]]
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
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }]
    ]
  }
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
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
        column: 1
      }
    ]
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
        column: 1
      }
    ]
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
        column: 3
      }
    ]
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
        column: 3
      }
    ]
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
        column: 16
      },
      {
        messageId: "incompleteBranch",
        type: "ExpressionStatement",
        line: 5,
        column: 16
      }
    ]
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
        column: 5
      }
    ]
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
        column: 12
      }
    ]
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
        column: 3
      }
    ]
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
        column: 10
      }
    ]
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
        column: 3
      }
    ]
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
        column: 5
      }
    ]
  }
];

// Exhaustive type test. - Not currently supported.
// {
//   code: dedent`
//     type T = "a" | "b";
//     function foo(i: T) {
//       switch(i) {
//         case "a":
//           return 1;
//         case "b":
//           return 2;
//       }
//     }`,
//   optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]]
// }

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid)
  });
});
