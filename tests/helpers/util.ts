import type {
  SharedConfigurationSettings,
  TSESLint,
} from "@typescript-eslint/utils";
import type { Rule, RuleTester as ESLintRuleTester } from "eslint";

import ts from "~/conditional-imports/typescript";

import { filename as dummyFilename } from "./configs";

type OptionsSets = {
  /**
   * The set of options this test case should pass for.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  optionsSet: any[];

  /**
   * The set of settings this test case should pass for.
   */

  settingsSet?: SharedConfigurationSettings[];
};

export type ValidTestCase = Omit<
  ESLintRuleTester.ValidTestCase,
  "options" | "settings"
> &
  OptionsSets;

export type InvalidTestCase = Omit<
  ESLintRuleTester.InvalidTestCase,
  "options" | "settings"
> &
  OptionsSets;

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processInvalidTestCase(
  testCases: InvalidTestCase[]
): ESLintRuleTester.InvalidTestCase[] {
  return testCases.flatMap((testCase) =>
    testCase.optionsSet.flatMap((options) => {
      const { optionsSet, settingsSet, ...eslintTestCase } = testCase;

      return (settingsSet ?? [undefined]).map((settings) => {
        return {
          filename: dummyFilename,
          ...eslintTestCase,
          options,
          settings,
        } as ESLintRuleTester.InvalidTestCase;
      });
    })
  );
}

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processValidTestCase(
  testCases: ValidTestCase[]
): ESLintRuleTester.ValidTestCase[] {
  // Ideally these two functions should be merged into 1 but I haven't been able
  // to get the typing information right - so for now they are two functions.
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return processInvalidTestCase(testCases as any);
}

/**
 * Create a dummy rule for testing.
 */
export function createDummyRule(
  create: (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    context: TSESLint.RuleContext<"generic", any>
  ) => TSESLint.RuleListener
): Rule.RuleModule {
  const meta: TSESLint.RuleMetaData<"generic"> = {
    type: "suggestion",
    docs: {
      description: "Disallow mutable variables.",
      url: "",
    },
    messages: {
      generic: "Error.",
    },
    fixable: "code",
    schema: {},
  };

  return {
    meta,
    create,
  } as unknown as Rule.RuleModule;
}

export type RuleTesterTests = {
  valid?: Array<ESLintRuleTester.ValidTestCase | string>;
  invalid?: ESLintRuleTester.InvalidTestCase[];
};

/**
 * Adds filenames to the tests (needed for typescript to work when parserOptions.project has been set).
 */
export function addFilename(
  filename: string,
  tests: RuleTesterTests
): RuleTesterTests {
  const { valid, invalid } = tests;
  return {
    invalid: invalid?.map((test) => ({
      ...test,
      filename,
    })),
    valid: valid?.map((test) =>
      typeof test === "string"
        ? { code: test, filename }
        : { ...test, filename }
    ),
  };
}

/**
 * Returns whether or not TypeScript is installed locally.
 */
export function isTsInstalled(): boolean {
  return ts !== undefined;
}
