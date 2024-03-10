import { type rule } from "#eslint-plugin-functional/rules/no-try-statements";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]],
  },
  {
    code: `try {} catch (e) {}`,
    optionsSet: [[{ allowCatch: true }]],
  },
  {
    code: `try {} finally {}`,
    optionsSet: [[{ allowFinally: true }]],
  },
];

export default tests;
