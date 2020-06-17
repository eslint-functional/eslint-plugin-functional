import { TSESLint } from "@typescript-eslint/experimental-utils";
import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import {
  IgnoreAccessorPatternOption,
  IgnorePatternOption,
  shouldIgnore,
} from "../../src/common/ignore-options";
import { filename, es9 } from "../helpers/configs";
import { addFilename, createDummyRule } from "../helpers/util";

type RuleTesterTests = {
  // eslint-disable-next-line functional/prefer-readonly-type
  valid?: Array<string | RuleTester.ValidTestCase>;
  // eslint-disable-next-line functional/prefer-readonly-type
  invalid?: Array<RuleTester.InvalidTestCase>;
};

describe("option: ignore", () => {
  describe("ignoreAccessorPattern", () => {
    const tests: ReadonlyArray<TSESLint.ValidTestCase<
      readonly [boolean, IgnoreAccessorPatternOption]
    >> = [
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

    new RuleTester(es9).run(
      "AssignmentExpression",
      createDummyRule((context) => {
        const [allowed, options] = context.options;
        return {
          AssignmentExpression: (node) => {
            expect(shouldIgnore(node, context, options)).toBe(allowed);
          },
        };
      }) as Rule.RuleModule,
      addFilename(filename, {
        valid: [...tests],
        invalid: [],
      }) as RuleTesterTests
    );
  });

  describe("ignorePattern", () => {
    const assignmentExpressionTests: ReadonlyArray<TSESLint.ValidTestCase<
      readonly [boolean, IgnorePatternOption]
    >> = [
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

    new RuleTester(es9).run(
      "AssignmentExpression",
      createDummyRule((context) => {
        const [allowed, options] = context.options;
        return {
          AssignmentExpression: (node) => {
            expect(shouldIgnore(node, context, options)).toBe(allowed);
          },
        };
      }) as Rule.RuleModule,
      addFilename(filename, {
        valid: [...assignmentExpressionTests],
        invalid: [],
      }) as RuleTesterTests
    );

    const expressionStatementTests: ReadonlyArray<TSESLint.ValidTestCase<
      readonly [boolean, IgnorePatternOption]
    >> = [
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

    new RuleTester(es9).run(
      "ExpressionStatement",
      createDummyRule((context) => {
        const [allowed, options] = context.options;
        return {
          ExpressionStatement: (node) => {
            expect(shouldIgnore(node, context, options)).toBe(allowed);
          },
        };
      }) as Rule.RuleModule,
      addFilename(filename, {
        valid: [...expressionStatementTests],
        invalid: [],
      }) as RuleTesterTests
    );
  });
});
