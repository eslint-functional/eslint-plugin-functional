import { name, rule } from "~/rules/no-class";
import { testUsing } from "~/tests/helpers/testers";

import es6Tests from "./es6";

testUsing.typescript(name, rule, es6Tests);

testUsing.es6(name, rule, es6Tests);
