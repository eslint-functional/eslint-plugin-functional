import {
  RuleTester,
  type RuleTesterConfig,
} from "@typescript-eslint/rule-tester";
import { afterAll, it, describe } from "vitest";

/* eslint-disable functional/immutable-data */
RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;
/* eslint-enable functional/immutable-data */

export function getRuleTester(config: RuleTesterConfig) {
  return new RuleTester(config);
}
