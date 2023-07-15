import assert from "node:assert/strict";

import { type ValidTestCase } from "@typescript-eslint/rule-tester";
import dedent from "dedent";

import {
  type IgnoreAccessorPatternOption,
  type IgnorePatternOption,
} from "#eslint-plugin-functional/options";
import { shouldIgnorePattern } from "#eslint-plugin-functional/options";
import { getAvaRuleTester } from "#eslint-plugin-functional/tests/helpers/AvaRuleTester";
import {
  filename,
  configs,
} from "#eslint-plugin-functional/tests/helpers/configs";
import {
  addFilename,
  createDummyRule,
} from "#eslint-plugin-functional/tests/helpers/util";

/**
 * Create a dummy rule that operates on AssignmentExpression nodes.
 */
function createDummyAssignmentExpressionRule() {
  return createDummyRule((context) => {
    const [allowed, options] = context.options;
    return {
      AssignmentExpression: (node) => {
        assert(
          shouldIgnorePattern(
            node,
            context,
            options.ignorePattern,
            options.ignoreAccessorPattern,
          ) === allowed,
        );
      },
    };
  });
}

const tests: Array<ValidTestCase<[boolean, IgnoreAccessorPatternOption]>> = [
  // Exact match.
  {
    code: dedent`
      mutable = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable" }],
  },
  {
    code: dedent`
      mutable.foo = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable.foo" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      mutable.foo.bar = 0;
      mutable.foo[0] = 0;
      mutable.foo["foo-bar"] = 0;
    `,
    options: [false, { ignoreAccessorPattern: "mutable" }],
  },
  // Prefix match.
  {
    code: dedent`
      mutable_ = 0;
      mutable_xxx = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable_*" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;
    `,
    options: [false, { ignoreAccessorPattern: "mutable_*" }],
  },
  // Suffix match.
  {
    code: dedent`
      _mutable = 0;
      xxx_mutable = 0;
    `,
    options: [true, { ignoreAccessorPattern: "*_mutable" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      xxx_mutable.foo = 0;
      xxx_mutable[0] = 0;
      xxx_mutable["foo-bar"] = 0;
    `,
    options: [false, { ignoreAccessorPattern: "*_mutable" }],
  },
  // Middle match.
  {
    code: dedent`
      xxx_mutable_xxx = 0;
    `,
    options: [true, { ignoreAccessorPattern: "*_mutable_*" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx.foo = 0;
      xxx_mutable_xxx[0] = 0;
      xxx_mutable_xxx["foo-bar"] = 0;
    `,
    options: [false, { ignoreAccessorPattern: "*_mutable_*" }],
  },
  // Mutable properties.
  {
    code: dedent`
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable_*.*" }],
  },
  {
    code: dedent`
      mutable_xxx = 0;
      mutable_xxx.foo.bar = 0;
      mutable_xxx.foo[0] = 0;
      mutable_xxx.foo["foo-bar"] = 0;
    `,
    options: [false, { ignoreAccessorPattern: "mutable_*.*" }],
  },
  // Mutable deep properties.
  {
    code: dedent`
      mutable_xxx.foo.bar[0] = 0;
      mutable_xxx.foo.bar["foo-bar"] = 0;
      mutable_xxx.foo.bar = [0, 1, 2];
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable_*.*.**" }],
  },
  {
    code: dedent`
      mutable_xxx = 0;
    `,
    options: [false, { ignoreAccessorPattern: "mutable_*.*.**" }],
  },
  // Mutable deep properties and container.
  {
    code: dedent`
      mutable_xxx.foo.bar[0] = 0;
      mutable_xxx.foo.bar["foo-bar"] = 0;
      mutable_xxx.foo.bar = [0, 1, 2];
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;
      mutable_xxx = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable_*.**" }],
  },
];

getAvaRuleTester("esLatest", configs.esLatest).run(
  "AssignmentExpression",
  createDummyAssignmentExpressionRule(),
  addFilename(filename, {
    valid: tests,
    invalid: [],
  }),
);

const assignmentExpressionTests: Array<
  ValidTestCase<[boolean, IgnorePatternOption]>
> = [
  // Prefix match.
  {
    code: dedent`
      mutable_ = 0;
      mutable_xxx = 0;
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
    `,
    options: [true, { ignorePattern: "^mutable_" }],
  },
  // Suffix match.
  {
    code: dedent`
      _mutable = 0;
      xxx_mutable = 0;
      foo.xxx_mutable = 0;
    `,
    options: [true, { ignorePattern: "_mutable$" }],
  },
  // Middle match.
  {
    code: dedent`
      mutable = 0;
    `,
    options: [true, { ignorePattern: "^mutable$" }],
  },
  {
    code: dedent`
      mutable.foo.bar = 0;
      mutable.bar[0] = 0;
    `,
    options: [false, { ignorePattern: "^mutable$" }],
  },
];

getAvaRuleTester("esLatest", configs.esLatest).run(
  "AssignmentExpression",
  createDummyAssignmentExpressionRule(),
  addFilename(filename, {
    valid: assignmentExpressionTests,
    invalid: [],
  }),
);

const expressionStatementTests: Array<
  ValidTestCase<[boolean, IgnorePatternOption]>
> = [
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignorePattern: "^const x" }],
  },
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignorePattern: "= 0;$" }],
  },
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignorePattern: "^const x = 0;$" }],
  },
];

getAvaRuleTester("esLatest", configs.esLatest).run(
  "ExpressionStatement",
  createDummyRule((context) => {
    const [allowed, options] = context.options;
    return {
      ExpressionStatement: (node) => {
        assert(
          shouldIgnorePattern(node, context, options.ignorePattern) === allowed,
        );
      },
    };
  }),
  addFilename(filename, {
    valid: expressionStatementTests,
    invalid: [],
  }),
);
