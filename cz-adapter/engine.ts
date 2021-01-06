import chalk from "chalk";
import wrap from "word-wrap";

import { rules } from "~/rules";

import type { Options } from ".";

type Answers = {
  readonly type: string;
  readonly scope: string;
  readonly scopeRules: string;
  readonly subject: string;
  readonly body: string;
  readonly isBreaking: boolean;
  readonly breaking: string;
  readonly isIssueAffected: boolean;
  readonly issues: string;
};

/**
 * The engine.
 */
export default (options: Options) => {
  return {
    prompter: (cz, commit) => {
      // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then -- This is promise-like, not an actual promise.
      promptUser(cz, options).then(doCommit(commit, options));
    },
  };
};

/**
 * Prompt the user.
 */
function promptUser(cz, options: Options) {
  const { types } = options;

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
      default: options.defaultType,
    },
    {
      type: "input",
      name: "scope",
      message: "What is the scope of this change: (press enter to skip)",
      default: options.defaultScope,
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
      default: options.defaultScope,
      when: (answers: Answers) => {
        return scopeRulesType.has(answers.type);
      },
      filter: filterScope(options),
    },
    {
      type: "input",
      name: "subject",
      message(answers) {
        return `Write a short, imperative tense description of the change (max ${maxSummaryLength(
          options,
          answers
        )} chars):\n`;
      },
      default: options.defaultSubject,
      validate: (subject, answers) => {
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
      transformer: (subject, answers) => {
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
      default: options.defaultBody,
    },
    {
      type: "confirm",
      name: "isBreaking",
      message: "Are there any breaking changes?",
      default: false,
    },
    {
      type: "input",
      name: "breaking",
      message: "Describe the breaking changes:\n",
      when: (answers: Answers) => {
        return answers.isBreaking;
      },
    },

    {
      type: "confirm",
      name: "isIssueAffected",
      message: "Does this change affect any open issues?",
      default: Boolean(options.defaultIssues),
    },
    {
      type: "input",
      name: "issues",
      message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
      when: (answers: Answers) => {
        return answers.isIssueAffected;
      },
      default: options.defaultIssues ? options.defaultIssues : undefined,
    },
  ]);
}

/**
 * Create the commit.
 */
function doCommit(
  commit: (msg: string) => void,
  options: Options
): (answers: Answers) => void {
  const wrapOptions = {
    trim: true,
    cut: false,
    newline: "\n",
    indent: "",
    width: options.maxLineWidth,
  };

  return (answers: Answers) => {
    // Parentheses are only needed when a scope is present.
    const scopeValue = answers.scope ?? answers.scopeRules;
    const scope = scopeValue ? `(${scopeValue})` : "";

    // Hard limit is applied by the validate.
    const head = `${answers.type + scope}: ${answers.subject}`;

    // Wrap these lines at options.maxLineWidth characters.
    const body = answers.body ? wrap(answers.body, wrapOptions) : false;

    // Apply breaking change prefix, removing it if already present
    const breakingTrimmed = answers.breaking ? answers.breaking.trim() : "";
    const breakingPrefixed =
      breakingTrimmed.length > 0
        ? `BREAKING CHANGE: ${breakingTrimmed.replace(
            /^BREAKING CHANGE: /u,
            ""
          )}`
        : "";
    const breaking = breakingPrefixed
      ? wrap(breakingPrefixed, wrapOptions)
      : false;

    const issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

    // Assemble the commmit message.
    const message = arrayFilterFalsy([head, body, breaking, issues]).join(
      "\n\n"
    );

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
  return Object.keys(rules).map((name) => ({ name, value: name }));
}

/**
 * How long is the header?
 */
function headerLength(answers: Answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
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
