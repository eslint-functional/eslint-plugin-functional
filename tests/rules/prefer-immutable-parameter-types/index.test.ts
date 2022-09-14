import { name, rule } from "~/rules/prefer-immutable-parameter-types";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
