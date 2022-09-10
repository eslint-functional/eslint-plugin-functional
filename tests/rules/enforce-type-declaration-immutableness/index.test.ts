import { name, rule } from "~/rules/enforce-type-declaration-immutableness";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
