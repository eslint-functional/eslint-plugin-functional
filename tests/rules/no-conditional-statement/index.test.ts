import { name, rule } from "~/rules/no-conditional-statement";
import { testUsing } from "~/tests/helpers/testers";

// import tsTests from "./ts";
import es3Tests from "./es3";

// testUsing.typescript(name, rule, ts);
testUsing.typescript(name, rule, es3Tests);

testUsing.es3(name, rule, es3Tests);
