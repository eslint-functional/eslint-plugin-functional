import { name, rule } from "#eslint-plugin-functional/rules/no-loop-statements";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import es6Tests from "./es2015";
import es3Tests from "./es3";

const tester = testRule(name, rule);

const allTest = {
  valid: [...es3Tests.valid, ...es6Tests.valid],
  invalid: [...es3Tests.invalid, ...es6Tests.invalid],
};

tester.typescript(allTest);
tester.esLatest(allTest);

tester.es3(es3Tests);
