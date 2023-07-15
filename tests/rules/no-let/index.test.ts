import { name, rule } from "#eslint-plugin-functional/rules/no-let";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import es6Tests from "./es2015";

const tester = testRule(name, rule);

tester.typescript(es6Tests);

tester.esLatest(es6Tests);

tester.es2015(es6Tests);
