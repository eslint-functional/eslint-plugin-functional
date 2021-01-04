import { name, rule } from "~/rules/prefer-type-literal";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
