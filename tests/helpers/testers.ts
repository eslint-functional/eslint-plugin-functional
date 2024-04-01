import { type RuleDefinition } from "#eslint-plugin-functional/utils/rule";

import { getRuleTester } from "./RuleTester";
import { configs } from "./configs";
import {
  type InvalidTestCaseSet,
  type ValidTestCaseSet,
  processInvalidTestCase,
  processValidTestCase,
} from "./util";

type TestFunction<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>,
> = (tests: {
  valid: Array<ValidTestCaseSet<TOptions>>;
  invalid: Array<InvalidTestCaseSet<TMessageIds, TOptions>>;
}) => void;

export function testRule<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>,
>(ruleName: string, rule: RuleDefinition<TMessageIds, TOptions>) {
  return Object.fromEntries(
    [...Object.entries(configs)].map(
      ([configName, config]): [
        keyof typeof configs,
        TestFunction<TMessageIds, TOptions>,
      ] => [
        configName as keyof typeof configs,
        ({ valid, invalid }) => {
          const ruleTester = getRuleTester(config);

          ruleTester.run(ruleName, rule as any, {
            valid: processValidTestCase(valid),
            invalid: processInvalidTestCase(invalid),
          });
        },
      ],
    ),
  ) as Record<keyof typeof configs, TestFunction<TMessageIds, TOptions>>;
}
