import chalk from "chalk";
import wrap from "word-wrap";

import { rules } from "~/rules";

import type { Options } from "./options";

type Answers = {
  readonly type: string;
  readonly scope?: string;
  readonly scopeRules?: string;
  readonly subject: string;
  readonly body?: string;
  readonly isBreaking: boolean;
  readonly isIssueAffected: boolean;
  readonly issues?: string;
};

type CZ = any;

/**
 * The engine.
 */
export default (
  options: Options
): { prompter: (cz: CZ, commit: (msg: string) => unknown) => void } => {
  return {
    prompter: (cz, commit) =>
      promptUser(cz, options).then(doCommit(commit, options)),
  };
};

/**
 * Prompt the user.
 */
function promptUser(cz: CZ, options: Options) {
  const {
    types,
    defaultType,
    defaultScope,
    defaultSubject,
    defaultBody,
    defaultIssues,
  } = options;

  const typesLength =
    Object.keys(types).reduce(
      (longest, current) =>
        longest >= current.length ? longest : current.length,
      0
    ) + 1;
  const typesChoices = Object.entries(types).map(([key, type]) => ({
    name: `${`${key}:`.padEnd(typesLength)} ${type.description}`,
    value: key,
  }));

  const scopeRulesType = new Set<string>([
    "feat",
    "fix",
    "perf",
    "refactor",
    "test",
  ]);

  return cz.prompt([
    {
      type: "list",
      name: "type",
      message: "Select the type of change that you're committing:",
      choices: typesChoices,
      default: defaultType,
    },
    {
      type: "input",
      name: "scope",
      message: "What is the scope of this change: (press enter to skip)",
      default: defaultScope,
      when: (answers: Answers) => {
        return !scopeRulesType.has(answers.type);
      },
      filter: filterScope(options),
    },
    {
      type: "list",
      name: "scopeRules",
      message: "Which rule does this change apply to:",
      choices: getRulesChoices(),
      default: defaultScope,
      when: (answers: Answers) => {
        return scopeRulesType.has(answers.type);
      },
      filter: filterScope(options),
    },
    {
      type: "confirm",
      name: "isBreaking",
      message: "Are there any breaking changes?",
      default: false,
    },
    {
      type: "input",
      name: "subject",
      message(answers: Answers) {
        return `Write a short, imperative tense description of the change (max ${maxSummaryLength(
          options,
          answers
        )} chars):\n`;
      },
      default: defaultSubject,
      validate: (subject: string, answers: Answers) => {
        const filteredSubject = filterSubject(options)(subject);
        return filteredSubject.length === 0
          ? "subject is required"
          : filteredSubject.length <= maxSummaryLength(options, answers)
          ? true
          : `Subject length must be less than or equal to ${maxSummaryLength(
              options,
              answers
            )} characters. Current length is ${
              filteredSubject.length
            } characters.`;
      },
      transformer: (subject: string, answers: Answers) => {
        const filteredSubject = filterSubject(options)(subject);
        const color =
          filteredSubject.length <= maxSummaryLength(options, answers)
            ? chalk.green
            : chalk.red;
        return color(`(${filteredSubject.length}) ${subject}`);
      },
      filter: filterSubject(options),
    },
    {
      type: "input",
      name: "body",
      message:
        "Provide a longer description of the change: (press enter to skip)\n",
      default: defaultBody,
    },
    {
      type: "confirm",
      name: "isIssueAffected",
      message: "Does this change affect any open issues?",
      default: Boolean(defaultIssues),
    },
    {
      type: "input",
      name: "issues",
      message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
      when: (answers: Answers) => {
        return answers.isIssueAffected;
      },
      default: defaultIssues,
    },
  ]);
}

/**
 * Create the commit.
 */
function doCommit(
  commit: (msg: string) => unknown,
  options: Options
): (answers: Answers) => unknown {
  const wrapOptions = {
    trim: true,
    cut: false,
    newline: "\n",
    indent: "",
    width: options.maxLineWidth,
  };

  return (answers: Answers) => {
    const breakingMarker = answers.isBreaking ? "!" : "";

    // Parentheses are only needed when a scope is present.
    const scopeValue = answers.scope ?? answers.scopeRules ?? "";
    const scope = scopeValue.length > 0 ? `(${scopeValue})` : "";
    // Hard limit is applied by the validate.
    const head = `${answers.type + breakingMarker + scope}: ${answers.subject}`;

    const bodyValue = (answers.body ?? "").trim();
    const bodyValueWithBreaking =
      answers.isBreaking && bodyValue.length > 0
        ? `BREAKING CHANGE: ${bodyValue.replace(/^breaking change: /iu, "")}`
        : bodyValue;

    const body =
      bodyValueWithBreaking.length > 0
        ? wrap(bodyValueWithBreaking, wrapOptions)
        : false;

    const issues =
      (answers.issues?.length ?? 0) > 0
        ? wrap(answers.issues!, wrapOptions)
        : false;

    // Assemble the commit message.
    const message = arrayFilterFalsy([head, body, issues]).join("\n\n");

    // Print the commit message.
    const hr = `${"-".repeat(options.maxLineWidth)}\n`;
    console.info(`\ncommit message:\n${hr}${message}\n${hr}`);

    // Do the commit.
    return commit(message);
  };
}

/**
 * Filter out falsy values from the given array.
 */
function arrayFilterFalsy<T>(array: ReadonlyArray<T>) {
  return array.filter(Boolean);
}

/**
 * The all the rules as prompt choices.
 */
function getRulesChoices() {
  return [
    {
      name: "-- none/multiple --",
      value: undefined,
    },
    ...Object.keys(rules).map((name) => ({ name, value: name })),
  ];
}

/**
 * How long is the header?
 */
function headerLength(answers: Answers) {
  const scopeLength = answers.scope?.length ?? answers.scopeRules?.length ?? 0;

  return (
    answers.type.length +
    2 +
    (scopeLength > 0 ? scopeLength + 2 : 0) +
    (answers.isBreaking ? 1 : 0)
  );
}

/**
 * What's the max length the summary can be.
 */
function maxSummaryLength(options: Options, answers: Answers) {
  return options.maxHeaderWidth - headerLength(answers);
}

/**
 * Get a function to auto-process the scope.
 */
function filterScope(options: Options) {
  return (value: string) => {
    return options.disableScopeLowerCase
      ? value.trim()
      : value.trim().toLowerCase();
  };
}

/**
 * Get a function to auto-process the subject.
 */
function filterSubject(options: Options) {
  return (subject: string) => {
    let mutableSubject = subject.trim();
    if (
      !options.disableSubjectLowerCase &&
      mutableSubject.charAt(0).toLowerCase() !== mutableSubject.charAt(0)
    ) {
      mutableSubject =
        mutableSubject.charAt(0).toLowerCase() +
        mutableSubject.slice(1, mutableSubject.length);
    }
    // eslint-disable-next-line functional/no-loop-statement
    while (mutableSubject.endsWith(".")) {
      mutableSubject = mutableSubject.slice(0, -1);
    }
    return mutableSubject;
  };
}
