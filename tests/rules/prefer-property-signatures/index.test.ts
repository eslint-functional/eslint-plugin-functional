import { name, rule } from "~/rules/prefer-property-signatures";
import { testUsing } from "~/tests/helpers/testers";

import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
