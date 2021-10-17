import { name, rule } from "~/rules/prefer-readonly-type-declaration";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
