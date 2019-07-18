import {
  RuleContext,
  RuleListener,
  RuleMetaData
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { Rule, RuleTester as ESLintRuleTester } from "eslint";

import { createRule } from "../src/util/rule";

type OptionsSet = {
  /**
   * The set of options this test case should pass for.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  readonly optionsSet: ReadonlyArray<any>;
};

export type ValidTestCase = Omit<ESLintRuleTester.ValidTestCase, "options"> &
  OptionsSet;

export type InvalidTestCase = Omit<
  ESLintRuleTester.InvalidTestCase,
  "options"
> &
  OptionsSet;

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processValidTestCase(
  testCases: ReadonlyArray<ValidTestCase>
): Array<ESLintRuleTester.ValidTestCase> {
  // Ideally these two functions should be merged into 1 but I haven't been able
  // to get the typing information right - so for now they are two functions.
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return processInvalidTestCase(testCases as any);
}

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processInvalidTestCase(
  testCases: ReadonlyArray<InvalidTestCase>
): Array<ESLintRuleTester.InvalidTestCase> {
  return testCases.reduce<ReadonlyArray<ESLintRuleTester.InvalidTestCase>>(
    (testCasesCarry, testCase) => {
      return [
        ...testCasesCarry,
        ...testCase.optionsSet.reduce<
          ReadonlyArray<ESLintRuleTester.InvalidTestCase>
        >((optionsSetCarry, options) => {
          const { optionsSet, ...eslintTestCase } = testCase;
          return [
            ...optionsSetCarry,
            {
              ...eslintTestCase,
              options
            }
          ];
        }, [])
      ];
    },
    []
    /* eslint-disable ts-immutable/readonly-array */
  ) as Array<ESLintRuleTester.InvalidTestCase>;
}

export function createDummyRule(
  create: (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    context: RuleContext<"generic", any>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    optionsWithDefault: any
  ) => RuleListener
): Rule.RuleModule {
  const meta: RuleMetaData<"generic"> = {
    type: "suggestion",
    docs: {
      description: "Disallow mutable variables.",
      category: "Best Practices",
      recommended: "error",
      url: ""
    },
    messages: {
      generic: "Error."
    },
    fixable: "code",
    schema: {}
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return createRule<"generic", Array<any>>("dummy", meta, [], create);
}
