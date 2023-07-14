import { type rule } from "~/rules/no-try-statements";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

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
