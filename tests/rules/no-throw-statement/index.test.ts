import { name, rule } from "~/rules/no-throw-statement";
import { testUsing } from "~/tests/helpers/testers";

import es3Tests from "./es3";
import es7Tests from "./es7";

testUsing.typescript(name, rule, es7Tests);
testUsing.typescript(name, rule, es3Tests);

testUsing.es7(name, rule, es7Tests);
testUsing.es3(name, rule, es3Tests);
