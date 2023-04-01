import * as semver from "semver";

import ts from "~/conditional-imports/typescript";
import { name, rule } from "~/rules/prefer-tacit";
import { testRule } from "~/tests/helpers/testers";

import es6Tests from "./es2015";
import es3Tests from "./es3";
import tsTests from "./ts";
import tsAtLeast4Dot7Tests from "./ts-at-least-4.7";
import tsLessThan4Dot7Tests from "./ts-less-than-4.7";

const tester = testRule(name, rule);

const isTS4dot7 =
  ts !== undefined &&
  semver.satisfies(ts.version, `>= 4.7.0 || >= 4.7.1-rc || >= 4.7.0-beta`, {
    includePrerelease: true,
  });

if (isTS4dot7) {
  tester.typescript(tsAtLeast4Dot7Tests);
} else {
  tester.typescript(tsLessThan4Dot7Tests);
}

tester.typescript(tsTests);
tester.typescript(es6Tests);
tester.typescript(es3Tests);

tester.esLatest(es6Tests);
tester.esLatest(es3Tests);

tester.es2015(es6Tests);
tester.es3(es3Tests);
