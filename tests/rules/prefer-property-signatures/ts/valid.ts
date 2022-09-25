import dedent from "dedent";

import type { ValidTestCase } from "~/tests/helpers/util";

const tests: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar: (a: number, b: string) => number;
      }
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo2 = {
        bar: (a: number, b: string) => number
      }
    `,
    optionsSet: [[]],
  },
  {
    code: dedent`
      interface Foo extends Readonly<{
        methodSignature(): void
      }>{}
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        methodSignature(): void
      }>{}
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
  {
    code: dedent`
      type Foo = Readonly<{
        methodSignature(): void
      }>
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        methodSignature(): void
      }>
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        nested: Readonly<{
          methodSignature(): void
        }>
      }>
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: {
          deepNested: Readonly<{
            methodSignature(): void
          }>
        }
      }>{}
    `,
    optionsSet: [[{ ignoreIfReadonlyWrapped: true }]],
  },
];

export default tests;
