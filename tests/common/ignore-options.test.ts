import {
  type InvalidTestCase,
  type ValidTestCase,
} from "@typescript-eslint/rule-tester";
import dedent from "dedent";

import {
  shouldIgnorePattern,
  type IgnoreAccessorPatternOption,
  type IgnoreCodePatternOption,
  type IgnoreIdentifierPatternOption,
} from "#eslint-plugin-functional/options";
import { getRuleTester } from "#eslint-plugin-functional/tests/helpers/RuleTester";
import {
  configs,
  filename,
} from "#eslint-plugin-functional/tests/helpers/configs";
import {
  addFilename,
  createDummyRule,
} from "#eslint-plugin-functional/tests/helpers/util";

/**
 * Create a dummy rule that operates on AssignmentExpression nodes.
 */
function createDummyRuleFor(nodeType: string) {
  return createDummyRule((context) => {
    const [allowed, options] = context.options;
    return {
      [nodeType]: (node) => {
        return {
          context,
          descriptors:
            shouldIgnorePattern(
              node,
              context,
              options.ignoreIdentifierPattern,
              options.ignoreAccessorPattern,
              options.ignoreCodePattern,
            ) === allowed
              ? []
              : [{ node, messageId: "generic" }],
        };
      },
    };
  });
}

const validTests: Array<ValidTestCase<[boolean, IgnoreAccessorPatternOption]>> =
  [
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

const invalidTests: Array<
  InvalidTestCase<"generic", [boolean, IgnoreAccessorPatternOption]>
> = [
  // Exact match.
  {
    code: dedent`
      immutable = 0;
    `,
    options: [true, { ignoreAccessorPattern: "mutable" }],
    errors: [
      {
        messageId: "generic",
      },
    ],
  },
];

getRuleTester(configs.esLatest).run(
  "ignoreAccessorPattern",
  createDummyRuleFor("AssignmentExpression"),
  addFilename(filename, {
    valid: validTests,
    invalid: invalidTests,
  }),
);

const assignmentExpressionValidTests: Array<
  ValidTestCase<[boolean, IgnoreIdentifierPatternOption]>
> = [
  // Prefix match.
  {
    code: dedent`
      mutable_ = 0;
      mutable_xxx = 0;
      mutable_xxx.foo = 0;
      mutable_xxx[0] = 0;
    `,
    options: [true, { ignoreIdentifierPattern: "^mutable_" }],
  },
  // Suffix match.
  {
    code: dedent`
      _mutable = 0;
      xxx_mutable = 0;
      foo.xxx_mutable = 0;
    `,
    options: [true, { ignoreIdentifierPattern: "_mutable$" }],
  },
  // Middle match.
  {
    code: dedent`
      mutable = 0;
    `,
    options: [true, { ignoreIdentifierPattern: "^mutable$" }],
  },
  {
    code: dedent`
      mutable.foo.bar = 0;
      mutable.bar[0] = 0;
    `,
    options: [false, { ignoreIdentifierPattern: "^mutable$" }],
  },
];

const assignmentExpressionInvalidTests: Array<
  InvalidTestCase<"generic", [boolean, IgnoreIdentifierPatternOption]>
> = [
  // Exact match.
  {
    code: dedent`
      immutable_xxx = 0;
    `,
    options: [true, { ignoreIdentifierPattern: "^mutable_" }],
    errors: [
      {
        messageId: "generic",
      },
    ],
  },
];

getRuleTester(configs.esLatest).run(
  "ignoreIdentifierPattern",
  createDummyRuleFor("AssignmentExpression"),
  addFilename(filename, {
    valid: assignmentExpressionValidTests,
    invalid: assignmentExpressionInvalidTests,
  }),
);

const expressionStatementValidTests: Array<
  ValidTestCase<[boolean, IgnoreCodePatternOption]>
> = [
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignoreCodePattern: "^const x" }],
  },
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignoreCodePattern: "= 0;$" }],
  },
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignoreCodePattern: "^const x = 0;$" }],
  },
];

const expressionStatementInvalidTests: Array<
  InvalidTestCase<"generic", [boolean, IgnoreCodePatternOption]>
> = [
  {
    code: dedent`
      const x = 0;
    `,
    options: [true, { ignoreCodePattern: "^const y" }],
    errors: [
      {
        messageId: "generic",
      },
    ],
  },
];

getRuleTester(configs.esLatest).run(
  "ignoreCodePattern",
  createDummyRuleFor("VariableDeclaration"),
  addFilename(filename, {
    valid: expressionStatementValidTests,
    invalid: expressionStatementInvalidTests,
  }),
);
