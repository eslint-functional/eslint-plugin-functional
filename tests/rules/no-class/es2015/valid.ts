import { type rule } from "#eslint-plugin-functional/rules/no-classes";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: "function Foo() {}",
    optionsSet: [[]],
  },
];

export default tests;
