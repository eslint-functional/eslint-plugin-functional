import {
  type InvalidTestCase,
  type RunTests,
  type ValidTestCase,
} from "@typescript-eslint/rule-tester";
import {
  type SharedConfigurationSettings,
  type TSESLint,
} from "@typescript-eslint/utils";
import { type NamedCreateRuleMeta } from "@typescript-eslint/utils/eslint-utils";

import {
  type RuleDefinition,
  type RuleFunctionsMap,
  createRuleUsingFunction,
} from "#eslint-plugin-functional/utils/rule";

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
  TOptions extends Readonly<unknown[]>,
> = Omit<InvalidTestCase<TMessageIds, TOptions>, "options" | "settings"> &
  OptionsSets;

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processInvalidTestCase<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>,
>(
  testCases: Array<InvalidTestCaseSet<TMessageIds, TOptions>>,
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
        }),
      );
    }),
  );
}

/**
 * Convert our test cases into ones eslint test runner is expecting.
 */
export function processValidTestCase<TOptions extends Readonly<unknown[]>>(
  testCases: Array<ValidTestCaseSet<TOptions>>,
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
    context: Readonly<TSESLint.RuleContext<"generic", any>>,
  ) => RuleFunctionsMap<any, "generic", any>,
): RuleDefinition<string, [boolean, ...unknown[]]> {
  const meta: NamedCreateRuleMeta<"generic", []> = {
    type: "suggestion",
    docs: {
      description: "rule used in testing",
    },
    messages: {
      generic: "Error.",
    },
    schema: {
      oneOf: [
        {
          type: "object",
        },
        {
          type: "array",
        },
      ],
    },
  };

  return createRuleUsingFunction(
    "dummy-rule",
    meta as any,
    [true, {}],
    create,
  ) as any;
}

/**
 * Adds filenames to the tests (needed for typescript to work when parserOptions.project has been set).
 */
export function addFilename<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>,
>(
  filename: string,
  tests: RunTests<TMessageIds, TOptions>,
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
          : { ...test, filename },
      ) ?? [],
  };
}

export type MessagesOf<T extends RuleDefinition<string, any>> =
  T extends RuleDefinition<infer Messages, any> ? Messages : never;

export type OptionsOf<T extends RuleDefinition<string, any>> =
  T extends RuleDefinition<string, infer Options> ? Options : never;
