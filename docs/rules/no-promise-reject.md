# Disallow rejecting promises (`functional/no-promise-reject`)

<!-- end auto-generated rule header -->

This rule disallows use of `Promise.reject()`.

## Rule Details

It is useful when using an `Option` type (something like `{ value: T } | { error: Error }`)
for handling errors. In this case a promise should always resolve with an `Option` and never reject.

This rule should be used in conjunction with [`no-throw-statements`](./no-throw-statements.md).

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```

### ✅ Correct

```js
/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? { error: new Error("Cannot divide by zero.") }
    : { value: xv / yv };
}
```
