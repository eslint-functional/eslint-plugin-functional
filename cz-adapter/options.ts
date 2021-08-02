import { types as conventionalCommitTypes } from "conventional-commit-types";

// Override the descriptions of some of the types.
const types = {
  ...conventionalCommitTypes,
  feat: {
    ...conventionalCommitTypes.feat,
    description: "A new feature (a rule or rule option)",
  },
  fix: {
    ...conventionalCommitTypes.fix,
    description: "A bug fix",
  },
  perf: {
    ...conventionalCommitTypes.perf,
    description: "A code change that improves performance",
  },
  refactor: {
    ...conventionalCommitTypes.refactor,
    description:
      "A code change that makes the code more readable/understandable",
  },
  style: {
    ...conventionalCommitTypes.style,
    description:
      "Changes that do not affect the meaning of the code (e.g. white-space, formatting, etc)",
  },
  docs: {
    ...conventionalCommitTypes.docs,
    description: "Documentation only changes",
  },
  test: {
    ...conventionalCommitTypes.test,
    description: "Adding or correcting tests",
  },
  build: {
    ...conventionalCommitTypes.build,
    description:
      "Changes that affect the build process or external dependencies",
  },
  ci: {
    ...conventionalCommitTypes.ci,
    description: "Changes to the CI or other GH workflows",
  },
  chore: {
    ...conventionalCommitTypes.chore,
    description: "Other changes that don't modify src or test files",
  },
};

const defaults: {
  readonly defaultType?: string;
  readonly defaultScope?: string;
  readonly defaultSubject?: string;
  readonly defaultBody?: string;
  readonly defaultIssues?: string;
} = {
  defaultType: process.env.CZ_TYPE,
  defaultScope: process.env.CZ_SCOPE,
  defaultSubject: process.env.CZ_SUBJECT,
  defaultBody: process.env.CZ_BODY,
  defaultIssues: process.env.CZ_ISSUES,
};

const options = {
  ...defaults,
  types,
  disableScopeLowerCase: false,
  disableSubjectLowerCase: false,
  maxHeaderWidth: 100,
  maxLineWidth: 100,
};

export type Options = typeof options;

export default options;
