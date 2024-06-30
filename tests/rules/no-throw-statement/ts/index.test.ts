import { name, rule } from "#/rules/no-throw-statements";
import { testRule } from "#/tests/helpers/testers";

import es2016Invalid from "../es2016/invalid";
import es2016Valid from "../es2016/valid";
import es3Invalid from "../es3/invalid";
import es3Valid from "../es3/valid";

import invalid from "./invalid";
import valid from "./valid";

const tests = {
  valid: [...es3Valid, ...es2016Valid, ...valid],
  invalid: [...es3Invalid, ...es2016Invalid, ...invalid],
};

const tester = testRule(name, rule);

tester.typescript(tests);
