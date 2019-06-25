import { RuleTester as ESLintRuleTester } from "eslint";

type OptionsSet = {
  /**
   * The set of options this test case should pass for.
   */
  optionsSet: ReadonlyArray<any>;
};

export type ValidTestCase = Omit<ESLintRuleTester.ValidTestCase, "options"> &
  OptionsSet;

export type InvalidTestCase = Omit<
  ESLintRuleTester.InvalidTestCase,
  "options"
> &
  OptionsSet;
/* eslint-disable prettier/prettier */

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processValidTestCase(
  testCases: ReadonlyArray<ValidTestCase>
): Array<ESLintRuleTester.ValidTestCase> {
  // Ideally these two functions should be merged into 1 but I haven't been able
  // to get the typing information right - so for now they are two functions.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return processInvalidTestCase(testCases as any);
}

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processInvalidTestCase(
  testCases: ReadonlyArray<InvalidTestCase>
): Array<ESLintRuleTester.InvalidTestCase> {
  return testCases.reduce<Array<ESLintRuleTester.InvalidTestCase>>((testCasesCarry, testCase) => {
    return [
      ...testCasesCarry,
      ...testCase.optionsSet.reduce<Array<ESLintRuleTester.InvalidTestCase>>((optionsSetCarry, options) => {
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
  }, []);
}

