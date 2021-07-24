import { name, rule } from "~/rules/no-method-signature";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
