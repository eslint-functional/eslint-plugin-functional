import { name, rule } from "#/rules/no-throw-statements";
import { testRule } from "#/tests/helpers/testers";

import es3Invalid from "../es3/invalid";
import es3Valid from "../es3/valid";

import invalid from "./invalid";
import valid from "./valid";

const tests = {
  valid: [...es3Valid, ...valid],
  invalid: [...es3Invalid, ...invalid],
};

const tester = testRule(name, rule);

tester.typescript(tests);
tester.esLatest(tests);
tester.es2016(tests);
