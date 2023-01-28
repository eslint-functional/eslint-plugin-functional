# Disallow try-catch[-finally] and try-finally patterns (`functional/no-try-statements`)

💼🚫 This rule is enabled in the following configs: `no-exceptions`, 🔒 `strict`. This rule is _disabled_ in the following configs: `lite`, ✅ `recommended`.

<!-- end auto-generated rule header -->

This rule disallows the `try` keyword.

## Rule Details

Try statements are not part of functional programming. See [no-throw-statements](./no-throw-statements.md) for more information.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-try-statements: "error" */

try {
  doSomethingThatMightGoWrong(); // <-- Might throw an exception.
} catch (error) {
  // Handle error.
}
```

### ✅ Correct

```js
/* eslint functional/no-try-statements: "error" */

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
};
```

### Default Options

```ts
const defaults = {
  allowCatch: false,
  allowFinally: false,
};
```

### `allowCatch`

If true, try-catch statements are allowed.

### `allowFinally`

If true, try-finally statements are allowed.
