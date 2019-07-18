# Prefer readonly types over mutable types (prefer-readonly-types)

This rule enforces use of the readonly modifier and readonly types.

## Rule Details

This rule enforces use of `readonly T[]` (`ReadonlyArray<T>`) over `T[]` (`Array<T>`).

The readonly modifier must appear on property signatures in interfaces, property declarations in classes, and index signatures.

### Benefits of using the `readonly` modifier

You might think that using `const` would eliminate mutation from your TypeScript code. **Wrong.** Turns out that there's a pretty big loophole in `const`.

```typescript
interface Point {
  x: number;
  y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // This is legal
```

This is why the `readonly` modifier exists. It prevents you from assigning a value to the result of a member expression.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.
```

This is just as effective as using Object.freeze() to prevent mutations in your Redux reducers. However the `readonly` modifier has **no run-time cost**, and is enforced at **compile time**. A good alternative to object mutation is to use the ES2016 object spread [syntax](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#object-spread-and-rest) that was added in typescript 2.1:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
const transformedPoint = { ...point, x: 99 };
```

Note that you can also use object spread when destructuring to [delete keys](http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35676025#35676025) in an object:

```typescript
let { [action.id]: deletedItem, ...rest } = state;
```

The `readonly` modifier also works on indexers:

```typescript
const foo: { readonly [key: string]: number } = { a: 1, b: 2 };
foo["a"] = 3; // Error: Index signature only permits reading
```

### Benefits of using `readonly T[]`

Even if an array is declared with `const` it is still possible to mutate the contents of the array.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const points: Array<Point> = [{ x: 23, y: 44 }];
points.push({ x: 1, y: 2 }); // This is legal
```

Using the `ReadonlyArray<T>` type or `readonly T[]` will stop this mutation:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const points: ReadonlyArray<Point> = [{ x: 23, y: 44 }];
// const points: readonly Point[] = [{ x: 23, y: 44 }]; // This is the alternative syntax for the line above

points.push({ x: 1, y: 2 }); // Unresolved method push()
```

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly checkImplicit: boolean
  readonly ignoreClass?: boolean;
  readonly ignoreInterface?: boolean;
  readonly ignoreLocal?: boolean;
  readonly ignorePattern?: string | Array<string>;
  readonly ignoreReturnType?: boolean;
};

const defaults = {
  checkImplicit: false,
  ignoreClass: false,
  ignoreInterface: false,
  ignoreLocal: false,
  ignoreReturnType: false
};
```

### `checkImplicit`

By default, this function only checks explicit types. Enabling this option will make the rule also check implicit types.

Note: Checking implicit types is more expensive (slow).

### `ignoreReturnType`

Doesn't check the return type of functions.

### `ignoreClass`

A boolean to specify if checking for `readonly` should apply to classes. `false` by default.

Examples of **incorrect** code for the `{ "ignoreClass": false }` option:

```ts
/*eslint ts-immutable/readonly: ["error", { "ignoreClass": false }]*/

class {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreClass": true }` option:

```ts
/*eslint ts-immutable/readonly: ["error", { "ignoreClass": true }]*/

class {
  myprop: string;
}
```

### `ignoreInterface`

A boolean to specify if checking for `readonly` should apply to interfaces. `false` by default.

Examples of **incorrect** code for the `{ "ignoreInterface": false }` option:

```ts
/*eslint ts-immutable/readonly: ["error", { "ignoreInterface": false }]*/

interface {
  myprop: string;
}
```

Examples of **correct** code for the `{ "ignoreInterface": true }` option:

```ts
/*eslint ts-immutable/readonly: ["error", { "ignoreInterface": true }]*/

interface {
  myprop: string;
}
```

### `ignoreLocal`

See the [ignoreLocal](./options/ignore-local.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
