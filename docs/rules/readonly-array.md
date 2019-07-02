### readonly-array

This rule enforces use of `ReadonlyArray<T>` or `readonly T[]` instead of `Array<T>` or `T[]`.

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

#### Has Fixer

Yes

#### Options

- [ignore-local](#using-the-ignore-local-option)
- [ignore-prefix](#using-the-ignore-prefix-option)
- [ignore-suffix](#using-the-ignore-suffix-option)
- [ignore-pattern](#using-the-ignore-pattern-option)
- [ignore-return-type](#using-the-ignore-return-type-option)
- [ignore-rest-parameters](#using-the-ignore-rest-parameters-option)

#### Example config

```javascript
"readonly-array": true
```

```javascript
"readonly-array": [true, "ignore-local"]
```

```javascript
"readonly-array": [true, "ignore-local", {"ignore-prefix": "mutable"}]
```

### Using the `ignore-rest-parameters` option

Doesn't check for `ReadonlyArray` for function rest parameters.

### Using the `ignore-return-type` option

Doesn't check the return type of functions.
