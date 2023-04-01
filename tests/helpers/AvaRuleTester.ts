import { AssertionError } from "node:assert/strict";

import {
  RuleTester,
  // @ts-expect-error -- Non-public type
  type RuleTesterConfig,
} from "@typescript-eslint/utils/eslint-utils/rule-tester";
import test from "ava";

import { isTsInstalled } from "./util";

let m_groupName: string | undefined;
let m_configName: string | undefined;

const testNames = new Map<string, number>();

// eslint-disable-next-line functional/immutable-data
RuleTester.describe = function describe(name: string, fn: () => void) {
  m_groupName = name;
  return void fn.apply(this);
};

// eslint-disable-next-line functional/immutable-data
RuleTester.it = function it(name: string, fn: () => void) {
  const testName = `${m_configName} - ${m_groupName} (v__VERSION__): ${name}`;
  const count = (testNames.get(testName) ?? 0) + 1;
  testNames.set(testName, count);
  const testFullName = testName.replace("__VERSION__", `${count}`);
  const testFn = isTsInstalled() ? test : test.skip;
  testFn(testFullName, (t) => {
    try {
      fn();
      t.pass();
    } catch (error) {
      if (error instanceof AssertionError) {
        // eslint-disable-next-line functional/immutable-data
        error.message += `\n\nActual:\n${error.actual}\n\nExpected:\n${error.expected}`;
      }

      throw error;
    }
  });
};

export function getAvaRuleTester(configName: string, config: RuleTesterConfig) {
  m_configName = configName;
  return new RuleTester(config);
}
