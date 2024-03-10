import {
  RuleTester,
  type RuleTesterConfig,
} from "@typescript-eslint/rule-tester";
import { afterAll, beforeAll, describe, it } from "vitest";

/* eslint-disable @typescript-eslint/naming-convention */
class VitestRuleTester extends RuleTester {
  public static afterAll = afterAll;
  public static beforeAll = beforeAll;
  public static it = it;
  public static itOnly = it.only;
  public static itSkip = it.skip;
  public static describe = describe;
  public static describeOnly = describe.only;
  public static describeSkip = describe.skip;
}
/* eslint-enable @typescript-eslint/naming-convention */

export function getRuleTester(config: RuleTesterConfig) {
  return new VitestRuleTester(config);
}
