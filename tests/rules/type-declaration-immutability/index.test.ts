import { name, rule } from "~/rules/type-declaration-immutability";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
