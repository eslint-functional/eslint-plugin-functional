import {
  name,
  rule,
} from "#eslint-plugin-functional/rules/no-throw-statements";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import es7Tests from "./es2016";
import es3Tests from "./es3";

const tester = testRule(name, rule);

tester.typescript(es7Tests);
tester.typescript(es3Tests);

tester.esLatest(es7Tests);
tester.esLatest(es3Tests);

tester.es2016(es7Tests);
tester.es3(es3Tests);
