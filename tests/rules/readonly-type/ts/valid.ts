import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/readonly-type";
import {
  type ValidTestCaseSet,
  type OptionsOf,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Not readonly
  {
    code: dedent`
      type Foo = {
        bar: string;
        baz: number;
      };
    `,
    optionsSet: [["generic"], ["keyword"]],
  },
  // Not readonly
  {
    code: dedent`
      type Foo = {
        readonly bar: string;
        baz: {
          qux: number;
        };
      };
    `,
    optionsSet: [["generic"], ["keyword"]],
  },
  // Readonly generic shallow
  {
    code: dedent`
      type Foo = Readonly<{
        bar: string;
        baz: number;
      }>;
    `,
    optionsSet: [["generic"]],
  },
  // Readonly generic deep
  {
    code: dedent`
      type Foo = Readonly<{
        bar: string;
        baz: Readonly<{
          qux: number;
        }>;
      }>;
    `,
    optionsSet: [["generic"]],
  },
  // Readonly keyword shallow
  {
    code: dedent`
      type Foo = {
        readonly bar: string;
        readonly baz: number;
      };
    `,
    optionsSet: [["keyword"]],
  },
  // Readonly keyword deep
  {
    code: dedent`
      type Foo = {
        readonly bar: string;
        readonly baz: {
          readonly qux: number;
        };
      };
    `,
    optionsSet: [["keyword"]],
  },
];

export default tests;
