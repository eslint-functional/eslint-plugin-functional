# Prefer readonly types over mutable types (prefer-readonly-type)

## :warning: This rule is deprecated

This rule has been replaced by [prefer-readonly-type-declaration](./prefer-readonly-type-declaration.md) and [@typescript-eslint/prefer-readonly-parameter-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md)

## Rule Details

This rule enforces use of `readonly T[]` (`ReadonlyArray<T>`) over `T[]` (`Array<T>`).

The readonly modifier must appear on property signatures in interfaces, property declarations in classes, and index signatures.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type: "error" */

interface Point {
  x: number;
  y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // This is perfectly valid.
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/prefer-readonly-type: "error" */

interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.
```

```ts
/* eslint functional/prefer-readonly-type: "error" */

interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
const transformedPoint = { ...point, x: 99 };
```

### Benefits of using the `readonly` modifier

A variable declared as `const` can not be reassigned, however what's in the variable can be mutated.
This is why the `readonly` modifier exists. It prevents you from assigning a value to the result of a member expression.
This is just as effective as using `Object.freeze()` to prevent mutations. However the `readonly` modifier has **no run-time cost**, and is enforced at **compile time**.

The `readonly` modifier also works on indexers:

<!-- eslint-disable @typescript-eslint/consistent-indexed-object-style -->

```ts
const foo: { readonly [key: string]: number } = { a: 1, b: 2 };
foo.a = 3; // Error: Index signature only permits reading
```

### Benefits of using `readonly T[]`

Even if an array is declared with `const` it is still possible to mutate the contents of the array.

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}
const points: Point[] = [{ x: 23, y: 44 }];
points.push({ x: 1, y: 2 }); // This is perfectly valid.
```

Using the `ReadonlyArray<T>` type or `readonly T[]` will stop this mutation:

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

const points: ReadonlyArray<Point> = [{ x: 23, y: 44 }];
// const points: readonly Point[] = [{ x: 23, y: 44 }]; // This is the alternative syntax for the line above

points.push({ x: 1, y: 2 }); // Unresolved method push()
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowLocalMutation: boolean;
  allowMutableReturnType: boolean;
  checkImplicit: boolean;
  ignoreClass: boolean | "fieldsOnly";
  ignoreInterface: boolean;
  ignoreCollections: boolean;
  ignorePattern?: string[] | string;
}
```

The default options:

```ts
const defaults = {
  allowLocalMutation: false,
  allowMutableReturnType: false,
  checkImplicit: false,
  ignoreClass: false,
  ignoreInterface: false,
  ignoreCollections: false,
}
```

### `checkImplicit`

By default, this function only checks explicit types. Enabling this option will make the rule also check implicit types.

Note: Checking implicit types is more expensive (slow).

### `allowMutableReturnType`

Doesn't check the return type of functions.

### `ignoreClass`

A boolean to specify if checking for `readonly` should apply to classes. `false` by default.

Examples of **incorrect** code for the `{ "ignoreClass": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreClass": false }] */

class {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreClass": true }` option:

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreClass": true }] */

class {
  myprop: string;
}
```

### `ignoreInterface`

A boolean to specify if checking for `readonly` should apply to interfaces. `false` by default.

Examples of **incorrect** code for the `{ "ignoreInterface": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreInterface": false }] */

interface I {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreInterface": true }` option:

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreInterface": true }] */

interface I {
  myprop: string;
}
```

### `ignoreCollections`

A boolean to specify if checking for `readonly` should apply to mutable collections (Array, Tuple, Set, and Map). Helpful for migrating from tslint-immutable to this plugin. `false` by default.

Examples of **incorrect** code for the `{ "ignoreCollections": false }` option:

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreCollections": false }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

Examples of **correct** code for the `{ "ignoreCollections": true }` option:

```ts
/* eslint functional/prefer-readonly-type: ["error", { "ignoreCollections": true }] */

const foo: number[] = [];
const bar: [string, string] = ["foo", "bar"];
const baz: Set<string, string> = new Set();
const qux: Map<string, string> = new Map();
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
