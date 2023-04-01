import { name, rule } from "~/rules/prefer-immutable-types";
import { testRule } from "~/tests/helpers/testers";

import tsTests from "./ts";

const tester = testRule(name, rule);

tester.typescript(tsTests);
