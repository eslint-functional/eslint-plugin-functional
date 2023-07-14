import dedent from "dedent";

import { type rule } from "~/rules/no-mixed-types";
import { type ValidTestCaseSet, type OptionsOf } from "~/tests/helpers/util";

const tests: Array<ValidTestCaseSet<OptionsOf<typeof rule>>> = [
  // Only properties should not produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };
    `,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }
    `,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Only functions should not produce failures
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };
    `,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }
    `,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Only indexer should not produce failures
  {
    code: dedent`
      type Foo = {
        [key: string]: string;
      };
    `,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        [key: string]: string;
      }
    `,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Check Off.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo(): number;
      };
    `,
    optionsSet: [[{ checkTypeLiterals: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }
    `,
    optionsSet: [[{ checkInterfaces: false }]],
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: () => number;
      };
    `,
    optionsSet: [[{ checkTypeLiterals: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }
    `,
    optionsSet: [[{ checkInterfaces: false }]],
  },
];

export default tests;
