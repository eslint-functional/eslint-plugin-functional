import { name, rule } from "~/rules/no-let";
import { testRule } from "~/tests/helpers/testers";

import es6Tests from "./es2015";

const tester = testRule(name, rule);

tester.typescript(es6Tests);

tester.esLatest(es6Tests);

tester.es2015(es6Tests);
