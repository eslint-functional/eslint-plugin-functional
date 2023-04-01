import type {
  SharedConfigurationSettings,
  TSESLint,
} from "@typescript-eslint/utils";
import type {
  RuleModule,
  ValidTestCase,
  InvalidTestCase,
  RunTests,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

import ts from "~/conditional-imports/typescript";

import { filename as dummyFilename } from "./configs";

type OptionsSets = {
  /**
   * The set of options this test case should pass for.
   */

  optionsSet: any[];

  /**
   * The set of settings this test case should pass for.
   */

  settingsSet?: SharedConfigurationSettings[];
};

export type ValidTestCaseSet<TOptions extends Readonly<unknown[]>> = Omit<
  ValidTestCase<TOptions>,
  "options" | "settings"
> &
  OptionsSets;

export type InvalidTestCaseSet<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>
> = Omit<InvalidTestCase<TMessageIds, TOptions>, "options" | "settings"> &
  OptionsSets;

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processInvalidTestCase<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>
>(
  testCases: Array<InvalidTestCaseSet<TMessageIds, TOptions>>
): Array<InvalidTestCase<TMessageIds, TOptions>> {
  return testCases.flatMap((testCase) =>
    testCase.optionsSet.flatMap((options) => {
      const { optionsSet, settingsSet, ...eslintTestCase } = testCase;

      return (settingsSet ?? [undefined]).map(
        (settings): InvalidTestCase<TMessageIds, TOptions> => ({
          filename: dummyFilename,
          ...eslintTestCase,
          options,
          // @ts-expect-error -- upstream typing.
          settings,
        })
      );
    })
  );
}

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processValidTestCase<TOptions extends Readonly<unknown[]>>(
  testCases: Array<ValidTestCaseSet<TOptions>>
): Array<ValidTestCase<TOptions>> {
  // Ideally these two functions should be merged into 1 but I haven't been able
  // to get the typing information right - so for now they are two functions.

  return processInvalidTestCase(testCases as any);
}

/**
 * Create a dummy rule for testing.
 */
export function createDummyRule(
  create: (
    context: TSESLint.RuleContext<"generic", any>
  ) => TSESLint.RuleListener
): RuleModule<string, [boolean, ...unknown[]]> {
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
  } as RuleModule<string, [boolean, ...unknown[]]>;
}

/**
 * Adds filenames to the tests (needed for typescript to work when parserOptions.project has been set).
 */
export function addFilename<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>
>(
  filename: string,
  tests: RunTests<TMessageIds, TOptions>
): RunTests<TMessageIds, TOptions> {
  const { valid, invalid } = tests;
  return {
    invalid:
      invalid.map((test) => ({
        ...test,
        filename,
      })) ?? [],
    valid:
      valid.map((test) =>
        typeof test === "string"
          ? { code: test, filename }
          : { ...test, filename }
      ) ?? [],
  };
}

/**
 * Returns whether or not TypeScript is installed locally.
 */
export function isTsInstalled(): boolean {
  return ts !== undefined;
}

export type MessagesOf<
  T extends RuleModule<string, ReadonlyArray<unknown>, RuleListener>
> = T extends RuleModule<infer Messages, ReadonlyArray<unknown>, RuleListener>
  ? Messages
  : never;

export type OptionsOf<
  T extends RuleModule<string, ReadonlyArray<unknown>, RuleListener>
> = T extends RuleModule<string, infer Options, RuleListener> ? Options : never;
