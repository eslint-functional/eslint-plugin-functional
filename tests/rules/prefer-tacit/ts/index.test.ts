import { name, rule } from "#eslint-plugin-functional/rules/prefer-tacit";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import invalid from "./invalid";

const tests = {
  valid: [],
  invalid,
};

const tester = testRule(name, rule);

tester.typescript(tests);
