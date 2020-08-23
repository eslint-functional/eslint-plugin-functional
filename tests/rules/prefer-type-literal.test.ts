/**
 * @file Tests for prefer-type-literal.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/prefer-type-literal";

import { typescript } from "../helpers/configs";
import {
  describeTsOnly,
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase,
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {}`,
    optionsSet: [[]],
    output: dedent`
      type Foo = {};`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = Bar & {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Baz {
        prop: string;
      }`,
    optionsSet: [[]],
    output: dedent`
      type Foo = Bar & Baz & {
        prop: string;
      };`,
    errors: [
      {
        messageId: "generic",
        type: "TSInterfaceDeclaration",
        line: 1,
        column: 1,
      },
    ],
  },
];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});
