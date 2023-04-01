import { name, rule } from "~/rules/no-conditional-statements";
import { testRule } from "~/tests/helpers/testers";

import es3Tests from "./es3";
import tsTests from "./ts";

const tester = testRule(name, rule);

tester.typescript(tsTests);
tester.typescript(es3Tests);

tester.esLatest(es3Tests);

tester.es3(es3Tests);
