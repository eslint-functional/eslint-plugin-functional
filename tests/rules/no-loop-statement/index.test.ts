import { name, rule } from "#eslint-plugin-functional/rules/no-loop-statements";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import es6Tests from "./es2015";
import es3Tests from "./es3";

const tester = testRule(name, rule);

tester.typescript(es6Tests);
tester.typescript(es6Tests);

tester.esLatest(es3Tests);
tester.esLatest(es3Tests);

tester.es2015(es6Tests);
tester.es3(es3Tests);
