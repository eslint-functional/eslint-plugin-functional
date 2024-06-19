import { type rule } from "#/rules/no-loop-statements";
import { type OptionsOf, type ValidTestCaseSet } from "#/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: `if (true) { console.log(); }`,
    optionsSet: [[]],
  },
];

export default tests;
