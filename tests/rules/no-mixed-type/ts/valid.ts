import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  // Only properties should not produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Only functions should not produce failures
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: number;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: number;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Only indexer should not produce failures
  {
    code: dedent`
      type Foo = {
        [key: string]: string;
      };`,
    optionsSet: [[], [{ checkInterfaces: false }]],
  },
  {
    code: dedent`
      interface Foo {
        [key: string]: string;
      }`,
    optionsSet: [[], [{ checkTypeLiterals: false }]],
  },
  // Check Off.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo(): number;
      };`,
    optionsSet: [[{ checkTypeLiterals: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo(): number;
      }`,
    optionsSet: [[{ checkInterfaces: false }]],
  },
  // Mixing properties and functions (PropertySignature) should produce failures.
  {
    code: dedent`
      type Foo = {
        bar: string;
        zoo: () => number;
      };`,
    optionsSet: [[{ checkTypeLiterals: false }]],
  },
  {
    code: dedent`
      interface Foo {
        bar: string;
        zoo: () => number;
      }`,
    optionsSet: [[{ checkInterfaces: false }]],
  },
];

export default tests;
