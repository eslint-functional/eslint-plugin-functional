import {
  RuleTester,
  type RuleTesterConfig,
} from "@typescript-eslint/rule-tester";
import { afterAll, beforeAll, describe, it } from "vitest";

/* eslint-disable ts/naming-convention */
class VitestRuleTester extends RuleTester {
  public static afterAll: typeof afterAll = afterAll;
  public static beforeAll: typeof beforeAll = beforeAll;
  public static it: typeof it = it;
  public static itOnly: typeof it.only = it.only;
  public static itSkip: typeof it.skip = it.skip;
  public static describe: typeof describe = describe;
  public static describeOnly: typeof describe.only = describe.only;
  public static describeSkip: typeof describe.skip = describe.skip;
}
/* eslint-enable ts/naming-convention */

export function getRuleTester(config: RuleTesterConfig): VitestRuleTester {
  return new VitestRuleTester(config);
}
