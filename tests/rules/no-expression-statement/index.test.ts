import { name, rule } from "~/rules/no-expression-statements";
import { testRule } from "~/tests/helpers/testers";

import es6Tests from "./es2015";
import es3Tests from "./es3";
import tsTests from "./ts";

const tester = testRule(name, rule);

tester.typescript(tsTests);
tester.typescript(es6Tests);
tester.typescript(es3Tests);

tester.esLatest(es6Tests);
tester.esLatest(es3Tests);

tester.es2015(es6Tests);
tester.es3(es3Tests);
