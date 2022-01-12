# Requires that function return values are typed as readonly (prefer-readonly-return-types)

This rules work just like [prefer-readonly-parameter-types](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md).

This rule should only be used in a purely functional environment to help ensure that values are not being mutated.

## Rule Details

This rule allows you to enforce that function return values resolve to a readonly type.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: "error" */

function array1(): string[] {} // array is not readonly
function array2(): readonly string[][] {} // array element is not readonly
function array3(): [string, number] {} // tuple is not readonly
function array4(): readonly [string[], number] {} // tuple element is not readonly
// the above examples work the same if you use ReadonlyArray<T> instead

function object1(): { prop: string } {} // property is not readonly
function object2(): { readonly prop: string; prop2: string } {} // not all properties are readonly
function object3(): { readonly prop: { prop2: string } } {} // nested property is not readonly
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  prop: string; // note: this property is mutable
}
function custom1(): CustomArrayType {}

interface CustomFunction {
  (): void;
  prop: string; // note: this property is mutable
}
function custom2(): CustomFunction {}

function union(): string[] | ReadonlyArray<number[]> {} // not all types are readonly

// rule also checks function types
interface Foo {
  (): string[];
}
interface Foo {
  new (): string[];
}
const x = { foo(): string[]; };
function foo(): string[];
type Foo = () => string[];
interface Foo {
  foo(): string[];
}
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/prefer-readonly-return-types: "error" */

function array1(): readonly string[] {}
function array2(): readonly (readonly string[])[] {}
function array3(): readonly [string, number] {}
function array4(): readonly [readonly string[], number] {}
// the above examples work the same if you use ReadonlyArray<T> instead

function object1(): { readonly prop: string } {}
function object2(): { readonly prop: string; readonly prop2: string } {}
function object3(): { readonly prop: { readonly prop2: string } } {}
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  readonly prop: string;
}
function custom1(): Readonly<CustomArrayType> {}
// interfaces that extend the array types are not considered arrays, and thus must be made readonly.

interface CustomFunction {
  (): void;
  readonly prop: string;
}
function custom2(): CustomFunction {}

function union(): readonly string[] | ReadonlyArray<number[]> {}

function primitive1(): string {}
function primitive2(): number {}
function primitive3(): boolean {}
function primitive4(): unknown {}
function primitive5(): null {}
function primitive6(): undefined {}
function primitive7(): any {}
function primitive8(): never {}
function primitive9(): number | string | undefined {}

function fnSig(): () => void {}

enum Foo { A, B }
function enum1(): Foo {}

function symb1(): symbol {}
const customSymbol = Symbol('a');
function symb2(): typeof customSymbol {}

// function types
interface Foo {
  (): readonly string[];
}
interface Foo {
  new (): readonly string[];
}
const x = { foo(): readonly string[]; };
function foo(): readonly string[];
type Foo = () => readonly string[];
interface Foo {
  foo(): readonly string[];
}
```

The default options:

```ts
const defaults = {
  allowLocalMutation: false,
  ignoreClass: false,
  ignoreCollections: false,
  ignoreInferredTypes: false,
  ignoreInterface: false,
  treatMethodsAsReadonly: false,
}
```

### `treatMethodsAsReadonly`

This option allows you to treat all mutable methods as though they were readonly. This may be desirable in when you are never reassigning methods.

Examples of **incorrect** code for this rule with `{treatMethodsAsReadonly: false}`:

```ts
type MyType = {
  readonly prop: string;
  method(): string; // note: this method is mutable
};
function foo(arg: MyType) {}
```

Examples of **correct** code for this rule with `{treatMethodsAsReadonly: false}`:

```ts
type MyType = Readonly<{
  prop: string;
  method(): string;
}>;
function foo(): MyType {}
type MyOtherType = {
  readonly prop: string;
  readonly method: () => string;
};
function bar(): MyOtherType {}
```

Examples of **correct** code for this rule with `{treatMethodsAsReadonly: true}`:

```ts
type MyType = {
  readonly prop: string;
  method(): string; // note: this method is mutable
};
function foo(): MyType {}
```

### `ignoreClass`

If set, classes will not be checked.

Examples of **incorrect** code for the `{ "ignoreClass": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreClass": false }] */

class {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreClass": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreClass": true }] */

class {
  myprop: string;
}
```

### `ignoreInterface`

If set, interfaces will not be checked.

Examples of **incorrect** code for the `{ "ignoreInterface": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreInterface": false }] */

interface I {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreInterface": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreInterface": true }] */

interface I {
  myprop: string;
}
```

### `ignoreCollections`

If set, collections (Array, Tuple, Set, and Map) will not be required to be readonly when used outside of type aliases and interfaces.

Examples of **incorrect** code for the `{ "ignoreCollections": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreCollections": false }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

Examples of **correct** code for the `{ "ignoreCollections": true }` option:

```ts
/* eslint functional/prefer-readonly-type-declaration: ["error", { "ignoreCollections": true }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

### `ignoreInferredTypes`

This option allows you to ignore types that aren't explicitly specified.

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

Use the given regex pattern(s) to match against the type's name (for objects this is the property's name not the object's name).

Note: If using this option to require mutable properties are marked as mutable via a naming convention (e.g. `{ "ignorePattern": "^[Mm]utable.+" }`),
type aliases and interfaces names will still need to comply with the `readonlyAliasPatterns` and `mutableAliasPatterns` options.

See the [ignorePattern](./options/ignore-pattern.md) docs for more info.
