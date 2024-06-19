import { name, rule } from "#/rules/prefer-immutable-types";
import { testRule } from "#/tests/helpers/testers";

import invalid from "./invalid";
import valid from "./valid";

const tests = {
  valid,
  invalid,
};

const tester = testRule(name, rule);

tester.typescript(tests);
