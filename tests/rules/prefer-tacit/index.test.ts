import { name, rule } from "~/rules/prefer-tacit";
import { testUsing } from "~/tests/helpers/testers";

import es3Tests from "./es3";
import es6Tests from "./es6";
import tsTests from "./ts";

testUsing.typescript(name, rule, tsTests);
testUsing.typescript(name, rule, es6Tests);
testUsing.typescript(name, rule, es3Tests);

testUsing.es6(name, rule, es6Tests);
testUsing.es3(name, rule, es3Tests);
