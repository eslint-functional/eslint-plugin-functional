import { type RuleModule } from "@typescript-eslint/utils/ts-eslint";

import { getRuleTester } from "./RuleTester";
import { configs } from "./configs";
import {
  processInvalidTestCase,
  processValidTestCase,
  type InvalidTestCaseSet,
  type ValidTestCaseSet,
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
>(ruleName: string, rule: RuleModule<TMessageIds, TOptions>) {
  return Object.fromEntries(
    [...Object.entries(configs)].map(
      ([configName, config]): [
        keyof typeof configs,
        TestFunction<TMessageIds, TOptions>,
      ] => [
        configName as keyof typeof configs,
        ({ valid, invalid }) => {
          const ruleTester = getRuleTester(config);

          ruleTester.run(ruleName, rule, {
            valid: processValidTestCase(valid),
            invalid: processInvalidTestCase(invalid),
          });
        },
      ],
    ),
  ) as Record<keyof typeof configs, TestFunction<TMessageIds, TOptions>>;
}
