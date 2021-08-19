import type { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import assert from "assert";
import test from "ava";
import dedent from "dedent";
import RuleTester from "eslint-ava-rule-tester";

import type {
  AllowLocalMutationOption,
  IgnoreAccessorPatternOption,
  IgnoreClassOption,
  IgnoreInterfaceOption,
  IgnorePatternOption,
} from "~/common/ignore-options";
import {
  shouldIgnoreClass,
  shouldIgnoreInterface,
  shouldIgnoreLocalMutation,
  shouldIgnorePattern,
} from "~/common/ignore-options";
import { filename, configs } from "~/tests/helpers/configs";
import { testWrapper } from "~/tests/helpers/testers";
import { addFilename, createDummyRule } from "~/tests/helpers/util";
import type { BaseOptions, RuleContext } from "~/util/rule";

/**
 *
 */
function shouldIgnore(
  node: TSESTree.Node,
  context: RuleContext<string, BaseOptions>,
  options: Partial<
    AllowLocalMutationOption &
      IgnoreAccessorPatternOption &
      IgnoreClassOption &
      IgnoreInterfaceOption &
      IgnorePatternOption
  >
): boolean {
  return [
    shouldIgnorePattern,
    shouldIgnoreClass,
    shouldIgnoreInterface,
    shouldIgnoreLocalMutation,
  ].some((testShouldIgnore) => testShouldIgnore(node, context, options));
}

/**
 * Create a dummy rule that operates on AssignmentExpression nodes.
 */
function createDummyAssignmentExpressionRule() {
  return createDummyRule((context) => {
    const [allowed, options] = context.options;
    return {
      AssignmentExpression: (node) => {
        assert(shouldIgnore(node, context, options) === allowed);
      },
    };
  });
}

const tests: ReadonlyArray<
  TSESLint.ValidTestCase<readonly [boolean, IgnoreAccessorPatternOption]>
> = [
  // Exact match.
  {
    code: dedent`
      mutable = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable" }],
  },
  {
    code: dedent`
      mutable.foo = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable.foo" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      mutable.foo.bar = 0;
      mutable.foo[0] = 0;
      mutable.foo["foo-bar"] = 0;`,
    options: [false, { ignoreAccessorPattern: "mutable" }],
  },
  // Prefix match.
  {
    code: dedent`
      mutable_ = 0;
      mutable_xxx = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable_*" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;`,
    options: [false, { ignoreAccessorPattern: "mutable_*" }],
  },
  // Suffix match.
  {
    code: dedent`
      _mutable = 0;
      xxx_mutable = 0;`,
    options: [true, { ignoreAccessorPattern: "*_mutable" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx = 0;
      xxx_mutable.foo = 0;
      xxx_mutable[0] = 0;
      xxx_mutable["foo-bar"] = 0;`,
    options: [false, { ignoreAccessorPattern: "*_mutable" }],
  },
  // Middle match.
  {
    code: dedent`
      xxx_mutable_xxx = 0;`,
    options: [true, { ignoreAccessorPattern: "*_mutable_*" }],
  },
  {
    code: dedent`
      x = 0;
      xxx_mutable_xxx.foo = 0;
      xxx_mutable_xxx[0] = 0;
      xxx_mutable_xxx["foo-bar"] = 0;`,
    options: [false, { ignoreAccessorPattern: "*_mutable_*" }],
  },
  // Mutable properties.
  {
    code: dedent`
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
      mutable_xxx["foo-bar"] = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable_*.*" }],
  },
  {
    code: dedent`
      mutable_xxx = 0;
      mutable_xxx.foo.bar = 0;
      mutable_xxx.foo[0] = 0;
      mutable_xxx.foo["foo-bar"] = 0;`,
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
      mutable_xxx["foo-bar"] = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable_*.*.**" }],
  },
  {
    code: dedent`
      mutable_xxx = 0;`,
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
      mutable_xxx = 0;`,
    options: [true, { ignoreAccessorPattern: "mutable_*.**" }],
  },
];

new RuleTester(testWrapper(test), configs.es10).run(
  "AssignmentExpression",
  createDummyAssignmentExpressionRule(),
  addFilename(filename, {
    valid: [...(tests as unknown as ReadonlyArray<RuleTester.ValidTestCase>)],
    invalid: [],
  })
);

const assignmentExpressionTests: ReadonlyArray<
  TSESLint.ValidTestCase<readonly [boolean, IgnorePatternOption]>
> = [
  // Prefix match.
  {
    code: dedent`
      mutable_ = 0;
      mutable_xxx = 0;
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;`,
    options: [true, { ignorePattern: "^mutable_" }],
  },
  // Suffix match.
  {
    code: dedent`
      _mutable = 0;
      xxx_mutable = 0;
      foo.xxx_mutable = 0;`,
    options: [true, { ignorePattern: "_mutable$" }],
  },
  // Middle match.
  {
    code: dedent`
      mutable = 0;`,
    options: [true, { ignorePattern: "^mutable$" }],
  },
  {
    code: dedent`
      mutable.foo.bar = 0;
      mutable.bar[0] = 0;`,
    options: [false, { ignorePattern: "^mutable$" }],
  },
];

new RuleTester(testWrapper(test), configs.es10).run(
  "AssignmentExpression",
  createDummyAssignmentExpressionRule(),
  addFilename(filename, {
    valid: [
      ...(assignmentExpressionTests as unknown as ReadonlyArray<RuleTester.ValidTestCase>),
    ],
    invalid: [],
  })
);

const expressionStatementTests: ReadonlyArray<
  TSESLint.ValidTestCase<readonly [boolean, IgnorePatternOption]>
> = [
  {
    code: dedent`
      const x = 0;`,
    options: [true, { ignorePattern: "^const x" }],
  },
  {
    code: dedent`
      const x = 0;`,
    options: [true, { ignorePattern: "= 0;$" }],
  },
  {
    code: dedent`
      const x = 0;`,
    options: [true, { ignorePattern: "^const x = 0;$" }],
  },
];

new RuleTester(testWrapper(test), configs.es10).run(
  "ExpressionStatement",
  createDummyRule((context) => {
    const [allowed, options] = context.options;
    return {
      ExpressionStatement: (node) => {
        assert(shouldIgnore(node, context, options) === allowed);
      },
    };
  }),
  addFilename(filename, {
    valid: [
      ...(expressionStatementTests as unknown as ReadonlyArray<RuleTester.ValidTestCase>),
    ],
    invalid: [],
  })
);
