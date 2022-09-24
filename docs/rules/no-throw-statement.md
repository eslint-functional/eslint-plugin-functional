# Disallow throwing exceptions (no-throw-statement)

This rule disallows the `throw` keyword.

## Rule Details

Exceptions are not part of functional programming.
As an alternative a function should return an error or in the case of an async function, a rejected promise.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-throw-statement: "error" */

throw new Error("Something went wrong.");
```

### ✅ Correct

```js
/* eslint functional/no-throw-statement: "error" */

function divide(x, y) {
  return y === 0 ? new Error("Cannot divide by zero.") : x / y;
}
```

```js
/* eslint functional/no-throw-statement: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowInAsyncFunctions: boolean;
}
```

### Default Options

```ts
const defaults = {
  allowInAsyncFunctions: false,
}
```

### Preset Overrides

#### `recommended`

```ts
const recommendedOptions = {
  allowInAsyncFunctions: true,
}
```

#### `lite`

```ts
const liteOptions = {
  allowInAsyncFunctions: true,
}
```

### `allowInAsyncFunctions`

If true, throw statements will be allowed within async functions.\
This essentially allows throw statements to be used as return statements for errors.

#### ✅ Correct

```js
/* eslint functional/no-throw-statement: ["error", { "allowInAsyncFunctions": true }] */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  if (yv === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return xv / yv;
}
```
