# Prefer readonly array over mutable arrays (readonly-array)

This rule enforces use of `ReadonlyArray<T>` or `readonly T[]` instead of `Array<T>` or `T[]`.

## Rule Details

Below is some information about the `ReadonlyArray<T>` type and the benefits of using it:

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
  readonly ignoreReturnType?: boolean;
  readonly ignoreLocal?: boolean;
  readonly ignorePattern?: string | Array<string>;
  readonly ignorePrefix?: string | Array<string>;
  readonly ignoreSuffix?: string | Array<string>;
};

const defaults = {
  ignoreReturnType: false,
  ignoreLocal: false
};
```

### `ignore-rest-parameters`

TODO: This option does not seem to exist in the code?

Doesn't check for `ReadonlyArray` for function rest parameters.

### `ignoreReturnType`

Doesn't check the return type of functions.

### `ignoreLocal`

See the [ignoreLocal](./options-ignore-local.md) docs.

### `ignorePattern`

See the [ignorePattern](./options-ignore-pattern.md) docs.
