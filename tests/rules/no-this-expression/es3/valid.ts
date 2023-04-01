import type { rule } from "~/rules/no-this-expressions";
import type { ValidTestCaseSet, OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]],
  },
];

export default tests;
