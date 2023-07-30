import { type rule } from "#eslint-plugin-functional/rules/no-this-expressions";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]],
  },
];

export default tests;
