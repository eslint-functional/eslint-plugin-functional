import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Exhaustive type test.
  {
    code: dedent`
      type T = "a" | "b";
      function foo(i: T) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: "ifExhaustive" }]],
  },
  // Check throws
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          throw 1;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
  },
  {
    code: dedent`
      function foo(i) {
        if (i === 1) {
          throw 1;
        } else {
          throw 2;
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }],
    ],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            throw 1;
          case "b":
          case "c":
            throw 2;
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
  },
  {
    code: dedent`
      function foo(i) {
        switch(i) {
          case "a":
            throw 1;
          case "b":
            throw 2;
          default:
            throw 3;
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }],
    ],
  },
  // Check never
  {
    code: dedent`
      declare function neverReturn(): never;
      function foo(i) {
        if (i === 1) {
          neverReturn();
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
  },
  {
    code: dedent`
      declare function neverReturn(): never;
      function foo(i) {
        if (i === 1) {
          neverReturn();
        } else {
          neverReturn();
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }],
    ],
  },
  {
    code: dedent`
      declare function neverReturn(): never;
      function foo(i) {
        switch(i) {
          case "a":
            neverReturn();
          case "b":
          case "c":
            neverReturn();
        }
      }`,
    optionsSet: [[{ allowReturningBranches: true }]],
  },
  {
    code: dedent`
      declare function neverReturn(): never;
      function foo(i) {
        switch(i) {
          case "a":
            neverReturn();
          case "b":
            neverReturn();
          default:
            neverReturn();
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }],
    ],
  },
  // Exhaustive type test.
  {
    code: dedent`
      type T = "a" | "b";
      function foo(i: T) {
        switch(i) {
          case "a":
            return 1;
          case "b":
            return 2;
        }
      }`,
    optionsSet: [
      [{ allowReturningBranches: true }],
      [{ allowReturningBranches: "ifExhaustive" }],
    ],
  },
];

export default tests;
