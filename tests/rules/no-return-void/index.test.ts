import { name, rule } from "~/rules/no-return-void";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
