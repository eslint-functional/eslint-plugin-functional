# Prefer immutable parameter types over mutable ones (prefer-immutable-parameter-types)

Although other rules can be used to ensure parameter are not mutated, it is
best to explicitly declare that the parameters are immutable.

It is also worth noting that as immutable types are not assignable to mutable
ones, users will not be able to pass something like a readonly array to a
functional that wants a mutable array; even if the function does not actually
mutate said array.

## Rule Details

This rule differs from the
[@typescript-eslint/prefer-readonly-parameter-types](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md)
rule by the fact that it uses the
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type) library to
calculated immutability. This library allows for more powerful and customizable
immutability enforcements to be made.

This rule is designed to replace the aforementioned rule.

### ❌ Incorrect

<!-- eslint-disable functional/prefer-immutable-parameter-types -->

```ts
/* eslint functional/prefer-immutable-parameter-types: "error" */

function array1(arg: string[]) {} // array is not readonly
function array2(arg: ReadonlyArray<string[]>) {} // array element is not readonly
function array3(arg: [string, number]) {} // tuple is not readonly
function array4(arg: readonly [string[], number]) {} // tuple element is not readonly
// the above examples work the same if you use ReadonlyArray<T> instead

function object1(arg: { prop: string }) {} // property is not readonly
function object2(arg: { readonly prop: string; prop2: string }) {} // not all properties are readonly
function object3(arg: { readonly prop: { prop2: string } }) {} // nested property is not readonly
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  prop: string; // note: this property is mutable
}
function custom1(arg: CustomArrayType) {}

interface CustomFunction {
  (): void;
  prop: string; // note: this property is mutable
}
function custom2(arg: CustomFunction) {}

function union(arg: string[] | ReadonlyArray<number[]>) {} // not all types are readonly

// rule also checks function types
interface Foo1 {
  (arg: string[]): void;
}
interface Foo2 {
  new (arg: string[]): void;
}
const x = { foo(arg: string[]): void; };
function foo(arg: string[]);
type Foo3 = (arg: string[]) => void;
interface Foo4 {
  foo(arg: string[]): void;
}
```

### ✅ Correct

<!-- eslint-disable functional/prefer-immutable-parameter-types -->

```ts
/* eslint functional/prefer-immutable-parameter-types: "error" */

function array1(arg: ReadonlyArray<string>) {}
function array2(arg: ReadonlyArray<ReadonlyArray<string>>) {}
function array3(arg: readonly [string, number]) {}
function array4(arg: readonly [ReadonlyArray<string>, number]) {}
// the above examples work the same if you use ReadonlyArray<T> instead

function object1(arg: { readonly prop: string }) {}
function object2(arg: { readonly prop: string; readonly prop2: string }) {}
function object3(arg: { readonly prop: { readonly prop2: string } }) {}
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  readonly prop: string;
}
function custom1(arg: Readonly<CustomArrayType>) {}
// interfaces that extend the array types are not considered arrays, and thus must be made readonly.

interface CustomFunction {
  (): void;
  readonly prop: string;
}
function custom2(arg: CustomFunction) {}

function union(arg: ReadonlyArray<string> | ReadonlyArray<number[]>) {}

function primitive1(arg: string) {}
function primitive2(arg: number) {}
function primitive3(arg: boolean) {}
function primitive4(arg: unknown) {}
function primitive5(arg: null) {}
function primitive6(arg: undefined) {}
function primitive7(arg: any) {}
function primitive8(arg: never) {}
function primitive9(arg: string | number | undefined) {}

function fnSig(arg: () => void) {}

enum Foo { a, b }
function enum1(arg: Foo) {}

function symb1(arg: symbol) {}
const customSymbol = Symbol('a');
function symb2(arg: typeof customSymbol) {}

// function types
interface Foo1 {
  (arg: ReadonlyArray<string>): void;
}
interface Foo2 {
  new (arg: ReadonlyArray<string>): void;
}
const x = { foo(arg: ReadonlyArray<string>): void; };
function foo(arg: ReadonlyArray<string>);
type Foo3 = (arg: ReadonlyArray<string>) => void;
interface Foo4 {
  foo(arg: ReadonlyArray<string>): void;
}
```

## Settings

This rule can leverage shared settings to configure immutability settings.

See the [immutability](./settings/immutability.md) docs.

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  enforcement: "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
}
```

### Default Options

```ts
const defaults = {
  enforcement: "Immutable",
}
```

### Preset Overrides

#### `recommended`

```ts
const recommendedOptions = {
  enforcement: "ReadonlyDeep",
}
```

#### `lite`

```ts
const liteOptions = {
  enforcement: "ReadonlyShallow",
}
```

### `enforcement`

The level of immutability that should be enforced.

**incorrect**:

<!-- eslint-disable functional/prefer-immutable-parameter-types -->

```ts
/* eslint functional/prefer-immutable-parameter-types: ["error", { "enforcement": "Immutable" }] */

function array(arg: ReadonlyArray<string>) {} // ReadonlyArray is not immutable
function set(arg: ReadonlySet<string>) {} // ReadonlySet is not immutable
function map(arg: ReadonlyMap<string>) {} // ReadonlyMap is not immutable
```

**correct**:

<!-- eslint-disable functional/prefer-immutable-parameter-types -->

```ts
/* eslint functional/prefer-immutable-parameter-types: ["error", { "enforcement": "Immutable" }] */

function set(arg: Readonly<ReadonlySet<string>>) {}
function map(arg: Readonly<ReadonlyMap<string>>) {}
function object(arg: Readonly<{ prop: string }>) {}
```

<!-- eslint-disable functional/prefer-immutable-parameter-types -->

```ts
/* eslint functional/prefer-immutable-parameter-types: ["error", { "enforcement": "ReadonlyShallow" }] */

function array(arg: ReadonlyArray<{ foo: string; }>) {}
function set(arg: ReadonlySet<{ foo: string; }>) {}
function map(arg: ReadonlyMap<{ foo: string; }>) {}
function object(arg: Readonly<{ prop: { foo: string; }; }>) {}
```
