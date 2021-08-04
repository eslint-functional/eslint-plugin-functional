import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const optionsReversedDefault = [
  {
    mustBeReadonly: {
      requireOthersToBeMutable: true,
    },
    mustBeMutable: {
      requireOthersToBeReadonly: false,
    },
  },
];

const tests: ReadonlyArray<ValidTestCase> = [
  // Readonly types should be readonly.
  {
    code: dedent`
      type MyType = {
        readonly a: string;
      };`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type ReadonlyMyType = {
        readonly a: string;
      };`,
    optionsSet: [optionsReversedDefault],
  },
  // Readonly types should be readonly and mutable types mutable.
  {
    code: dedent`
      type MutableMyType = {
        a: string;
      };
      type MyType = Readonly<MutableMyType>;`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type MyType = {
        a: string;
      };
      type ReadonlyMyType = Readonly<MyType>;`,
    optionsSet: [optionsReversedDefault],
  },
  // Readonly types should be readonly and mutable types mutable.
  {
    code: dedent`
      type Mutable<T> = { -readonly[P in keyof T]: T[P] };
      type MyType = {
        readonly a: string;
      };
      type MutableMyType = Mutable<MyType>;`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Mutable<T> = { -readonly[P in keyof T]: T[P] };
      type ReadonlyMyType = {
        readonly a: string;
      };
      type MyType = Mutable<ReadonlyMyType>;`,
    optionsSet: [optionsReversedDefault],
  },
];

export default tests;
