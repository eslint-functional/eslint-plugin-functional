import test from "ava";
import type { Implementation } from "ava";
import type { Rule } from "eslint";
import RuleTester from "eslint-ava-rule-tester";

import { configs } from "./configs";
import {
  processInvalidTestCase,
  processValidTestCase,
  isTsInstalled,
} from "./util";
import type { ValidTestCase, InvalidTestCase } from "./util";

type TestFunction = (
  ruleName: string,
  rule: Rule.RuleModule,
  tests: {
    valid: ValidTestCase[];
    invalid: InvalidTestCase[];
  }
) => void;

const testNames = new Map<string, number>();

/**
 * A wrapper function to wrap a given ava test function and issue a unique title
 * is given to each rule.
 */
export function testWrapper(
  avaTest: (title: string, callback: Implementation<unknown[]>) => void
) {
  return (title: string, callback: Implementation<unknown[]>) => {
    const count = (testNames.get(title) ?? 0) + 1;
    testNames.set(title, count);
    avaTest(`v${count} - ${title}`, callback);
  };
}

export const testUsing = Object.fromEntries(
  [...Object.entries(configs)].map(
    ([configName, config]) =>
      [
        configName,
        ((ruleName, rule, { valid, invalid }) => {
          const ruleTester = new RuleTester(
            testWrapper(
              configName === "typescript" && !isTsInstalled() ? test.skip : test
            ),
            config
          );

          ruleTester.run(ruleName, rule, {
            valid: processValidTestCase(valid),
            invalid: processInvalidTestCase(invalid),
          });
        }) as TestFunction,
      ] as const
  )
) as Record<keyof typeof configs, TestFunction>;
