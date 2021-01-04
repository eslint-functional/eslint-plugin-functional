import { name, rule } from "~/rules/no-throw-statement";
import { testUsing } from "~/tests/helpers/testers";

import es3Tests from "./es3";

testUsing.typescript(name, rule, es3Tests);

testUsing.es3(name, rule, es3Tests);
