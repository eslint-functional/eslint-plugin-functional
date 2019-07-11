# Disallow mutating arrays (no-array-mutation)

This rule prohibits mutating an array via assignment to or deletion of their elements/properties. This rule enforces array immutability without the use of `ReadonlyArray<T>` (as apposed to [readonly-array](./readonly-array.md)).

## Rule Details

```typescript
const x = [0, 1, 2];

x[0] = 4; // <- Mutating an array is not allowed.
x.length = 1; // <- Mutating an array is not allowed.
x.push(3); // <- Mutating an array is not allowed.
```

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly ignoreNewArray?: boolean;
  readonly ignorePattern?: string | Array<string>;
  readonly ignoreAccessorPattern?: string | Array<string>;
};

const defaults = {
  ignoreNewArray: true
};
```

### `ignore-new-array`

This option allows for the use of array mutator methods to be chained to newly created arrays.

For example, an array can be immutably sorted like so:

```typescript
const original = ["foo", "bar", "baz"];
const sorted = original.slice().sort((a, b) => a.localeCompare(b)); // This is OK with ignore-new-array - note the use of the `slice` method which returns a copy of the original array.
```

### `ignorePattern`

See the [ignorePattern](./options-ignore-pattern.md) docs.

### `ignoreAccessorPattern`

See the [ignoreAccessorPattern](./options-ignore-accessor-pattern.md) docs.
