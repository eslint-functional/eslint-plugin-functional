import * as semver from "semver";

import ts from "#eslint-plugin-functional/conditional-imports/typescript";
import { name, rule } from "#eslint-plugin-functional/rules/prefer-tacit";
import { testRule } from "#eslint-plugin-functional/tests/helpers/testers";

import tsTests from "./ts";
import tsAtLeast4Dot7Tests from "./ts-at-least-4.7";
import tsLessThan4Dot7Tests from "./ts-less-than-4.7";

const tester = testRule(name, rule);

const isTS4dot7 =
  ts !== undefined &&
  semver.satisfies(ts.version, `>= 4.7.0 || >= 4.7.1-rc || >= 4.7.0-beta`, {
    includePrerelease: true,
  });

tester.typescript(tsTests);

if (isTS4dot7) {
  tester.typescript(tsAtLeast4Dot7Tests);
} else {
  tester.typescript(tsLessThan4Dot7Tests);
}
