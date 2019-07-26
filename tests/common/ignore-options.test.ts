import { ValidTestCase } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import {
  IgnoreAccessorPatternOption,
  IgnorePatternOption,
  shouldIgnore
} from "../../src/common/ignore-options";
import { typescript } from "../helpers/configs";
import { createDummyRule } from "../helpers/util";

describe("option: ignore", () => {
  describe("ignoreAccessorPattern", () => {
    const tests: ReadonlyArray<
      ValidTestCase<readonly [boolean, IgnoreAccessorPatternOption]>
    > = [
      // Exact match.
      {
        code: dedent`
          mutable = 0;
          mutable.foo = 0;
          mutable[0] = 0;`,
        options: [true, { ignoreAccessorPattern: "mutable" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;
          mutable.foo.bar = 0;
          mutable.foo[0] = 0;`,
        options: [false, { ignoreAccessorPattern: "mutable" }]
      },
      // Prefix match.
      {
        code: dedent`
          mutable_ = 0;
          mutable_xxx = 0;
          mutable_xxx.foo = 0;
          mutable_xxx[0] = 0;`,
        options: [true, { ignoreAccessorPattern: "mutable_*" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;
          mutable_xxx.foo.bar = 0;
          mutable_xxx.foo[0] = 0;`,
        options: [false, { ignoreAccessorPattern: "mutable_*" }]
      },
      // Suffix match.
      {
        code: dedent`
          _mutable = 0;
          xxx_mutable = 0;
          xxx_mutable.foo = 0;
          xxx_mutable[0] = 0;`,
        options: [true, { ignoreAccessorPattern: "*_mutable" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;
          xxx_mutable.foo.bar = 0;
          xxx_mutable.foo[0] = 0;`,
        options: [false, { ignoreAccessorPattern: "*_mutable" }]
      },
      // Middle match.
      {
        code: dedent`
          xxx_mutable_xxx.foo = 0;
          xxx_mutable_xxx[0] = 0;
          xxx_mutable_xxx = 0;`,
        options: [true, { ignoreAccessorPattern: "*_mutable_*" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx.foo.bar = 0;
          xxx_mutable_xxx.foo[0] = 0;`,
        options: [false, { ignoreAccessorPattern: "*_mutable_*" }]
      },
      // Mutable self.
      {
        code: dedent`
          mutable_xxx.foo.bar = 0;
          mutable_xxx.foo[0] = 0;`,
        options: [true, { ignoreAccessorPattern: "mutable_*.*" }]
      },
      {
        code: dedent`
          mutable_xxx.foo.bar.baz = 0;
          mutable_xxx.foo = 0;
          mutable_xxx[0] = 0;`,
        options: [false, { ignoreAccessorPattern: "mutable_*.*" }]
      },
      // Mutable deep properties.
      {
        code: dedent`
          mutable_xxx.foo.bar.baz[0] = 0;
          mutable_xxx.foo.bar.baz = [0, 1, 2];
          mutable_xxx.foo.bar = 0;`,
        options: [true, { ignoreAccessorPattern: "mutable_*.**.*" }]
      },
      {
        code: dedent`
          mutable_xxx.foo = 0;`,
        options: [false, { ignoreAccessorPattern: "mutable_*.**.*" }]
      },
      // Mutable deep properties and mutable self.
      {
        code: dedent`
          mutable_xxx.foo.bar.baz[0] = 0;
          mutable_xxx.foo.bar.baz = [0, 1, 2];
          mutable_xxx.foo.bar = 0;
          mutable_xxx.foo = 0;`,
        options: [true, { ignoreAccessorPattern: "mutable_*.**" }]
      }
    ];

    new RuleTester(typescript).run(
      "AssignmentExpression",
      createDummyRule(context => {
        const [ignored, options] = context.options;
        return {
          AssignmentExpression: node => {
            expect(shouldIgnore(node, context, options)).toBe(ignored);
          }
        };
      }) as Rule.RuleModule,
      {
        valid: [...tests],
        invalid: []
      }
    );
  });

  describe("ignorePattern", () => {
    const assignmentExpressionTests: ReadonlyArray<
      ValidTestCase<readonly [boolean, IgnorePatternOption]>
    > = [
      // Prefix match.
      {
        code: dedent`
          mutable_ = 0;
          mutable_xxx = 0;
          mutable_xxx.foo = 0;
          mutable_xxx[0] = 0;`,
        options: [true, { ignorePattern: "^mutable_" }]
      },
      // Suffix match.
      {
        code: dedent`
          _mutable = 0;
          xxx_mutable = 0;
          xxx_mutable.foo = 0;
          xxx_mutable[0] = 0;`,
        options: [true, { ignorePattern: "_mutable$" }]
      },
      // Middle match.
      {
        code: dedent`
          mutable = 0;
          mutable.foo = 0;
          mutable[0] = 0;`,
        options: [true, { ignorePattern: "^mutable$" }]
      },
      {
        code: dedent`
          mutable.foo.bar = 0;
          mutable.bar[0] = 0;`,
        options: [false, { ignorePattern: "^mutable$" }]
      }
    ];

    new RuleTester(typescript).run(
      "AssignmentExpression",
      createDummyRule(context => {
        const [ignored, options] = context.options;
        return {
          AssignmentExpression: node => {
            expect(shouldIgnore(node, context, options)).toBe(ignored);
          }
        };
      }) as Rule.RuleModule,
      {
        valid: [...assignmentExpressionTests],
        invalid: []
      }
    );

    const expressionStatementTests: ReadonlyArray<
      ValidTestCase<readonly [boolean, IgnorePatternOption]>
    > = [
      {
        code: dedent`
          const x = 0;`,
        options: [true, { ignorePattern: "^const x" }]
      },
      {
        code: dedent`
          const x = 0;`,
        options: [true, { ignorePattern: "= 0;$" }]
      },
      {
        code: dedent`
          const x = 0;`,
        options: [true, { ignorePattern: "^const x = 0;$" }]
      }
    ];

    new RuleTester(typescript).run(
      "ExpressionStatement",
      createDummyRule(context => {
        const [ignored, options] = context.options;
        return {
          ExpressionStatement: node => {
            expect(shouldIgnore(node, context, options)).toBe(ignored);
          }
        };
      }) as Rule.RuleModule,
      {
        valid: [...expressionStatementTests],
        invalid: []
      }
    );
  });
});
