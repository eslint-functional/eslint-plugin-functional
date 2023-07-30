import {
  name,
  rule,
} from "#eslint-plugin-functional/rules/functional-parameters";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

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
tester.es2015(tests);
