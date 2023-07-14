import { type rule } from "~/rules/prefer-tacit";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: "function foo(x) { f(x); }",
    optionsSet: [[]],
  },
  {
    // No typedef for `f` therefore no error (when not assuming types).
    code: "var foo = function(x) { f(x); }",
    optionsSet: [[]],
  },
];

export default tests;
