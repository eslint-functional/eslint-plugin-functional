import { name, rule } from "~/rules/no-expression-statement";
import { testUsing } from "~/tests/helpers/testers";

import es3Tests from "./es3";
import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
testUsing.typescript(name, rule, es3Tests);

testUsing.es3(name, rule, es3Tests);
