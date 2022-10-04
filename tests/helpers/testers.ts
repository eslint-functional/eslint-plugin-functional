import test from "ava";
// eslint-disable-next-line ava/use-test
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
    valid: ReadonlyArray<ValidTestCase>;
    invalid: ReadonlyArray<InvalidTestCase>;
  }
) => void;

const testNames = new Map<string, number>();

/**
 * A wrapper function to wrap a given ava test function and issue a unique title
 * is given to each rule.
 */
export function testWrapper(
  // eslint-disable-next-line functional/prefer-readonly-type
  avaTest: (title: string, callback: Implementation<unknown[]>) => void
) {
  // eslint-disable-next-line functional/prefer-readonly-type
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
