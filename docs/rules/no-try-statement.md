# Disallow try-catch[-finally] and try-finally patterns (no-try-statement)

This rule disallows the `try` keyword.

## Rule Details

Try statements are not part of functional programming. See [no-throw-statement](./no-throw-statement.md) for more information.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-try-statement: "error" */

try {
  doSomethingThatMightGoWrong(); // <-- Might throw an exception.
} catch (error) {
  // Handle error.
}
```

### ✅ Correct

```js
/* eslint functional/no-try-statement: "error" */

doSomethingThatMightGoWrong() // <-- Returns a Promise
  .catch((error) => {
    // Handle error.
  });
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowCatch: boolean;
  allowFinally: boolean;
}
```

### Default Options

```ts
const defaults = {
  allowCatch: false,
  allowFinally: false
}
```

### `allowCatch`

If true, try-catch statements are allowed.

### `allowFinally`

If true, try-finally statements are allowed.
