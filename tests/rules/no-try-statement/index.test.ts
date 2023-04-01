import { name, rule } from "~/rules/no-try-statements";
import { testRule } from "~/tests/helpers/testers";

import es3Tests from "./es3";

const tester = testRule(name, rule);

tester.typescript(es3Tests);

tester.esLatest(es3Tests);

tester.es3(es3Tests);
