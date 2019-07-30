import { TSESLint } from "@typescript-eslint/experimental-utils";
import deepMerge, { Options as deepMergeOptions } from "deepmerge";
import { Linter, Rule, RuleTester as ESLintRuleTester } from "eslint";

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
    /* eslint-disable-next-line functional/prefer-readonly-type */
  ) as Array<ESLintRuleTester.InvalidTestCase>;
}

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

  return {
    meta,
    create
  } as Rule.RuleModule;
}

export type Config = Linter.Config & {
  readonly overrides?: ReadonlyArray<{
    readonly files: ReadonlyArray<string>;
    readonly rules: Linter.Config["rules"];
  }>;
};

/**
 * Create an empty target for the given value.
 */
function emptyTarget(value: unknown): {} {
  return Array.isArray(value) ? [] : {};
}

/**
 * Create a clone of the given value.
 */
function clone<T>(value: T, options: deepMergeOptions): T {
  return deepMerge<T>(emptyTarget(value), value, options);
}

/**
 * Combine merge 2 arrays.
 */
export function combineMerge<T extends object>(
  target: ReadonlyArray<T>,
  source: ReadonlyArray<T>,
  options: deepMergeOptions
): Array<T> {
  // TODO: make this function functional.
  /* eslint-disable */
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      const cloneRequested = options.clone !== false;
      const shouldClone = cloneRequested && options.isMergeableObject(item);
      destination[index] = shouldClone ? clone(item, options) : item;
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepMerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });

  return destination;
  /* eslint-enable */
}
