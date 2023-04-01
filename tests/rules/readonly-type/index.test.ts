import { name, rule } from "~/rules/readonly-type";
import { testRule } from "~/tests/helpers/testers";

import tsTests from "./ts";

const tester = testRule(name, rule);

tester.typescript(tsTests);
