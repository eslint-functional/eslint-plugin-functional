import dedent from "dedent";

import { type rule } from "~/rules/no-expression-statements";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Allow yield.
  {
    code: dedent`
      export function* foo() {
        yield "hello";
        return "world";
      }
    `,
    optionsSet: [[]],
  },
];

export default tests;
