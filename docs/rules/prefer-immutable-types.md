# Require function parameters to be typed as certain immutability (`functional/prefer-immutable-types`)

💼 This rule is enabled in the following configs: ☑️ `lite`, `no-mutations`, ✅ `recommended`, 🔒 `strict`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule is designed to be a replacement for
[@typescript-eslint/prefer-readonly-parameter-types](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md)
but also add extra functionality, allowing not just parameters to be checked.

This rule uses the
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type) library to
calculated immutability. This library allows for more powerful and customizable
immutability enforcements to be made.

With parameters specifically, it is also worth noting that as immutable types
are not assignable to mutable ones, and thus users will not be able to pass
something like a readonly array to a functional that wants a mutable array; even
if the function does not actually mutate said array.
Libraries should therefore always enforce this rule for parameters.

### Pure Functions

Ideally a pure function should always take immutable parameters and return a mutable value.
This is because pure functions don't cause any side-effects, such as mutating the parameters;
and they don't care what the caller then does with the returned value. However in practice this
isn't often practical.

For example, take this snippet of code:

```ts
type Foo = { hello: number };
type Bar = { world: number };

function addBar(foo: Readonly<Foo>) {
  return {
    foo,
    bar: { world: 2 },
  };
}

const foobar = addBar({ hello: 1 });
```

Here the return type of `addBar` is shallowly mutable, but it's not deeply
mutable as its `foo` property is immutable. To make it mutable, we'd need to
deeply clone the contents of `foo`, but in many cases, and for many reasons,
this would be a very bad thing to do. Simply casting `foo` to a mutable type can
also lead to type issues later in your codebase.

It also worth noting that the above function isn't ideally typed. The return
type of `addBar` will always state that `foo` is immutable, even if the caller
passed in a mutable `foo` value. It's putting an extra constraint on the return
type that shouldn't exits. A better typed version of this function would be as
so:

```ts
function addBar<F extends Readonly<Foo>>(foo: F) {
  return {
    foo,
    bar: { world: 2 },
  };
}
```

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: "error" */

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
const x = { foo(arg: string[]): void {} };
function foo(arg: string[]);
type Foo3 = (arg: string[]) => void;
interface Foo4 {
  foo(arg: string[]): void;
}
```

### ✅ Correct

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: "error" */

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

enum Foo {
  a,
  b,
}
function enum1(arg: Foo) {}

function symb1(arg: symbol) {}
const customSymbol = Symbol("a");
function symb2(arg: typeof customSymbol) {}

// function types
interface Foo1 {
  (arg: ReadonlyArray<string>): void;
}
interface Foo2 {
  new (arg: ReadonlyArray<string>): void;
}
const x = { foo(arg: ReadonlyArray<string>): void {} };
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
  enforcement: "None" | "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
  ignoreInferredTypes: boolean;
  ignoreClasses: boolean | "fieldsOnly";
  ignoreNamePattern?: string[] | string;
  ignoreTypePattern?: string[] | string;

  parameters?: {
    enforcement: "None" | "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
    ignoreInferredTypes: boolean;
    ignoreClasses: boolean | "fieldsOnly";
    ignoreNamePattern?: string[] | string;
    ignoreTypePattern?: string[] | string;
  };

  returnTypes?: {
    enforcement: "None" | "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
    ignoreInferredTypes: boolean;
    ignoreClasses: boolean | "fieldsOnly";
    ignoreNamePattern?: string[] | string;
    ignoreTypePattern?: string[] | string;
  };

  variables?: {
    enforcement: "None" | "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
    ignoreInFunctions: boolean;
    ignoreInferredTypes: boolean;
    ignoreClasses: boolean | "fieldsOnly";
    ignoreNamePattern?: string[] | string;
    ignoreTypePattern?: string[] | string;
  };

  fixer?: {
    ReadonlyShallow?:
      | { pattern: string; replace: string }
      | Array<{ pattern: string; replace: string }>;
    ReadonlyDeep?:
      | { pattern: string; replace: string }
      | Array<{ pattern: string; replace: string }>;
    Immutable?:
      | { pattern: string; replace: string }
      | Array<{ pattern: string; replace: string }>;
  };

  suggestions?: {
    ReadonlyShallow?: Array<Array<{ pattern: string; replace: string }>>;
    ReadonlyDeep?: Array<Array<{ pattern: string; replace: string }>>;
    Immutable?: Array<Array<{ pattern: string; replace: string }>>;
  };
};
```

### Default Options

```ts
const defaults = {
  enforcement: "Immutable",
  ignoreClasses: false,
  ignoreInferredTypes: false,
  fixer: false,
  suggestions: {
    ReadonlyShallow: [
      [
        {
          pattern:
            "^([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*\\[\\])$",
          replace: "readonly $1",
        },
        {
          pattern: "^(Array|Map|Set)<(.+)>$",
          replace: "Readonly$1<$2>",
        },
        {
          pattern: "^(.+)$",
          replace: "Readonly<$1>",
        },
      ],
    ],
  },
};
```

### Preset Overrides

#### `recommended`

```ts
const recommendedOptions = {
  enforcement: "None",
  ignoreInferredTypes: true,
  parameters: {
    enforcement: "ReadonlyDeep",
  },
};
```

#### `lite`

```ts
const liteOptions = {
  enforcement: "None",
  ignoreInferredTypes: true,
  parameters: {
    enforcement: "ReadonlyShallow",
  },
};
```

### `enforcement`

The level of immutability that should be enforced. One of the following:

- `None` - Don't enforce any immutability.
- `ReadonlyShallow` - Enforce that the data is shallowly immutable.
- `ReadonlyDeep` - Enforce that the data is deeply immutable (methods may not be).
- `Immutable` - Enforce that everything is deeply immutable, nothing can be modified.

#### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: ["error", { "enforcement": "Immutable" }] */

function array(arg: ReadonlyArray<string>) {} // ReadonlyArray is not immutable
function set(arg: ReadonlySet<string>) {} // ReadonlySet is not immutable
function map(arg: ReadonlyMap<string>) {} // ReadonlyMap is not immutable
```

#### ✅ Correct

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: ["error", { "enforcement": "Immutable" }] */

function set(arg: Readonly<ReadonlySet<string>>) {}
function map(arg: Readonly<ReadonlyMap<string>>) {}
function object(arg: Readonly<{ prop: string }>) {}
```

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: ["error", { "enforcement": "ReadonlyShallow" }] */

function array(arg: ReadonlyArray<{ foo: string }>) {}
function set(arg: ReadonlySet<{ foo: string }>) {}
function map(arg: ReadonlyMap<{ foo: string }>) {}
function object(arg: Readonly<{ prop: { foo: string } }>) {}
```

### `ignoreInferredTypes`

This option allows you to ignore values which don't explicitly specify a type.

One case where this may be desirable is when an external dependency
specifies a callback with mutable parameters, and manually annotating the
callback's parameters is undesirable.

`false` by default.

### `ignoreClasses`

A boolean to specify if checking classes should be ignored. `false` by default.

<!--tabs-->

#### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: ["error", { "ignoreInferredTypes": true }] */

import { acceptsCallback, type CallbackOptions } from "external-dependency";

acceptsCallback((options: CallbackOptions) => {});
```

<details>
<summary>external-dependency.d.ts</summary>

```ts
export interface CallbackOptions {
  prop: string;
}
type Callback = (options: CallbackOptions) => void;
type AcceptsCallback = (callback: Callback) => void;

export const acceptsCallback: AcceptsCallback;
```

</details>

#### ✅ Correct

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-immutable-types: ["error", { "ignoreInferredTypes": true }] */

import { acceptsCallback } from "external-dependency";

acceptsCallback((options) => {});
```

<details>
<summary>external-dependency.d.ts</summary>

```ts
export interface CallbackOptions {
  prop: string;
}
type Callback = (options: CallbackOptions) => void;
type AcceptsCallback = (callback: Callback) => void;

export const acceptsCallback: AcceptsCallback;
```

</details>

<!--/tabs-->

### `parameters.*`, `returnTypes.*`, `variables.*`

Override the options specifically for the given type of types.

#### `variables.ignoreInFunctions`

If true, the rule will not flag any variables that are inside of function bodies.

### `fixer`

Configure the fixer to work with your setup.
If set to `false`, the fixer will be disabled.

#### `fixer.*`

Configure how the fixer should fix issue of each of the different enforcement levels.

### `suggestions`

This is the same as `fixer` but for manual suggestions instead of automatic fixers.
If set to `false`, the no suggestions will be enabled.

### `suggestions[*].*`

Configure how the suggestion should fix issue of each of the different enforcement levels.

By default we only configure the suggestions to correct shallow readonly violations as TypeScript itself provides a utility type for this.
If you have access to other utility types (such as [type-fest's `ReadonlyDeep`](https://github.com/sindresorhus/type-fest#:~:text=set%20to%20optional.-,ReadonlyDeep,-%2D%20Create%20a%20deeply)), you can configure the fixer to use them with this option.

Example using `ReadonlyDeep` instead of `Readonly`:

```jsonc
{
  // ...
  "suggestions": {
    "ReadonlyDeep": [
      [
        {
          "pattern": "^(?:Readonly<(.+)>|(.+))$",
          "replace": "ReadonlyDeep<$1$2>"
        }
      ]
    ]
  }
}
```

### `ignoreNamePattern`

This option takes a `RegExp` string or an array of `RegExp` strings.
It allows for the ability to ignore violations based on the identifier (name) of node in question.

### `ignoreTypePattern`

This option takes a `RegExp` string or an array of `RegExp` strings.
It allows for the ability to ignore violations based on the type (as written, with whitespace removed) of the node in question.
