# Disallow try-catch[-finally] and try-finally patterns (no-try-statement)

This rule disallows the `try` keyword.

## Rule Details

Try statements are not part of functional programming. See [no-throw-statement](./no-throw-statement.md) for more information.

Examples of **incorrect** code for this rule:

```js
/* eslint functional/no-try-statement: "error" */

try {
  doSomethingThatMightGoWrong(); // <-- Might throw an exception.
} catch (error) {
  // Handle error.
}
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-try-statement: "error" */

doSomethingThatMightGoWrong() // <-- Returns a Promise.
  .catch((error) => {
    // Handle error.
  });
```

## Options

This rule accepts an options object of the following type:

```ts
{
  allowCatch: boolean;
  allowFinally: boolean;
}
```

The default options:

```ts
{
  allowCatch: false,
  allowFinally: false
}
```

### `allowCatch`

If true, try-catch statements are allowed.

### `allowFinally`

If true, try-finally statements are allowed.
