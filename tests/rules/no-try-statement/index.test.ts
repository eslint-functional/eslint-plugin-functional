import { name, rule } from "#eslint-plugin-functional/rules/no-try-statements";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import es3Tests from "./es3";

const tester = testRule(name, rule);

tester.typescript(es3Tests);

tester.esLatest(es3Tests);

tester.es3(es3Tests);
