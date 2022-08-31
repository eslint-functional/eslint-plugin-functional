import * as semver from "semver";

import ts from "~/conditional-imports/typescript";
import { name, rule } from "~/rules/prefer-tacit";
import { testUsing } from "~/tests/helpers/testers";

import es3Tests from "./es3";
import es6Tests from "./es6";
import tsTests from "./ts";
import ts4Dot7Tests from "./ts4.7";
import tsNot4Dot7Tests from "./tsNot4.7";

const isTS4dot7 =
  ts !== undefined &&
  semver.satisfies(ts.version, `>= 4.7.0 || >= 4.7.1-rc || >= 4.7.0-beta`, {
    includePrerelease: true,
  });

if (isTS4dot7) {
  testUsing.typescript(name, rule, ts4Dot7Tests);
} else {
  testUsing.typescript(name, rule, tsNot4Dot7Tests);
}

testUsing.typescript(name, rule, tsTests);
testUsing.typescript(name, rule, es6Tests);
testUsing.typescript(name, rule, es3Tests);

testUsing.es6(name, rule, es6Tests);
testUsing.es3(name, rule, es3Tests);
