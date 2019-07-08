import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import { shouldIgnore } from "../../src/common/ignore-options";
import { createDummyRule } from "../util";
import { typescript } from "../configs";

describe("option: ignore", () => {
  describe("ignoreAccessorPattern", () => {
    const tests = [
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
      // Nested-property match.
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
      // Deep property match.
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
        valid: tests,
        invalid: []
      }
    );
  });

  describe("ignorePattern", () => {
    const tests = [
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
        valid: tests,
        invalid: []
      }
    );
  });
});
