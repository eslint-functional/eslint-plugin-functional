import { type rule } from "#eslint-plugin-functional/rules/no-loop-statements";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: `if (true) { console.log(); }`,
    optionsSet: [[]],
  },
];

export default tests;
