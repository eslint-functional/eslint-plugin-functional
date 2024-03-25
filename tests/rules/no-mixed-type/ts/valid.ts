import dedent from "dedent";

import { type rule } from "#eslint-plugin-functional/rules/no-mixed-types";
import {
  type OptionsOf,
  type ValidTestCaseSet,
} from "#eslint-plugin-functional/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // // Only properties should not produce failures.
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo: number;
  //     };
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo: number;
  //     }
  //   `,
  //   optionsSet: [[], [{ checkTypeLiterals: false }]],
  // },
  // // Only functions should not produce failures
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo: number;
  //     };
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo: number;
  //     }
  //   `,
  //   optionsSet: [[], [{ checkTypeLiterals: false }]],
  // },
  // // Only indexer should not produce failures
  // {
  //   code: dedent`
  //     type Foo = {
  //       [key: string]: string;
  //     };
  //   `,
  //   optionsSet: [[], [{ checkInterfaces: false }]],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       [key: string]: string;
  //     }
  //   `,
  //   optionsSet: [[], [{ checkTypeLiterals: false }]],
  // },
  // // Check Off.
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo(): number;
  //     };
  //   `,
  //   optionsSet: [[{ checkTypeLiterals: false }]],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo(): number;
  //     }
  //   `,
  //   optionsSet: [[{ checkInterfaces: false }]],
  // },
  // // Mixing properties and functions (PropertySignature) should produce failures.
  // {
  //   code: dedent`
  //     type Foo = {
  //       bar: string;
  //       zoo: () => number;
  //     };
  //   `,
  //   optionsSet: [[{ checkTypeLiterals: false }]],
  // },
  // {
  //   code: dedent`
  //     interface Foo {
  //       bar: string;
  //       zoo: () => number;
  //     }
  //   `,
  //   optionsSet: [[{ checkInterfaces: false }]],
  // },
  {
    code: dedent`
      const func = (v: any): any => null;
      type Foo = typeof func;
      type FooBar = Readonly<{
        foo1: (v: any) => null;
        foo2: Foo;
      }>;
    `,
    optionsSet: [[]],
  },
];

export default tests;
