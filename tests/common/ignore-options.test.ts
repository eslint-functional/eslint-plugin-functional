import dedent from "dedent";
import { Rule, RuleTester } from "eslint";

import {
  shouldIgnore,
  IgnorePatternOptions
} from "../../src/common/ignore-options";
import { createDummyRule } from "../util";
import { typescript } from "../configs";
import { ValidTestCase } from "@typescript-eslint/experimental-utils/dist/ts-eslint";

describe("option: ignore", () => {
  describe("ignore-pattern", () => {
    const tests: ReadonlyArray<
      ValidTestCase<readonly [boolean, IgnorePatternOptions]>
    > = [
      // Exact match.
      {
        code: dedent`
          mutable = 0;`,
        options: [true, { ignorePattern: "mutable" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;`,
        options: [false, { ignorePattern: "mutable" }]
      },
      // Prefix match.
      {
        code: dedent`
          mutable_ = 0;
          mutable_xxx = 0;`,
        options: [true, { ignorePattern: "mutable_*" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;`,
        options: [false, { ignorePattern: "mutable_*" }]
      },
      // Suffix match.
      {
        code: dedent`
          _mutable = 0;
          xxx_mutable = 0;`,
        options: [true, { ignorePattern: "*_mutable" }]
      },
      {
        code: dedent`
          x = 0;
          xxx_mutable_xxx = 0;`,
        options: [false, { ignorePattern: "*_mutable" }]
      },
      // Middle match.
      {
        code: dedent`
          xxx_mutable_xxx = 0;`,
        options: [true, { ignorePattern: "*_mutable_*" }]
      },
      // Property match.
      {
        code: dedent`
          mutable_xxx.foo = 1;`,
        options: [true, { ignorePattern: "mutable_*.*" }]
      },
      {
        code: dedent`
          mutable_xxx.foo.bar.baz = 1;
          mutable_xxx.foo.bar = 1;`,
        options: [false, { ignorePattern: "mutable_*.*" }]
      },
      // Deep property match.
      {
        code: dedent`
          mutable_xxx.foo.bar.baz = 1;
          mutable_xxx.foo.bar = 1;
          mutable_xxx.foo = 1;`,
        options: [true, { ignorePattern: "mutable_*.**.*" }]
      }
    ];

    const ruleTester = new RuleTester(typescript);
    ruleTester.run(
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
});
