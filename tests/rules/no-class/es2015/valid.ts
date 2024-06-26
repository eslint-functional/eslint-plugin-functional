import { type rule } from "#/rules/no-classes";
import { type OptionsOf, type ValidTestCaseSet } from "#/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: "function Foo() {}",
    optionsSet: [[]],
  },
];

export default tests;
