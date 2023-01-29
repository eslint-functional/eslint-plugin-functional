import { name, rule } from "~/rules/prefer-immutable-types";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
