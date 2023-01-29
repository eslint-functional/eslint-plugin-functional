# Disallow try-catch[-finally] and try-finally patterns (`functional/no-promise-reject`)

<!-- end auto-generated rule header -->

This rule disallows use of `Promise.reject()`.

We don't recommend this rule but it's there for those who want it.

## Rule Details

You can view a `Promise` as a result object with built-in error (something like `{ value: T } | { error: Error }`) in which case a rejected `Promise` can be viewed as a returned result and thus fits with functional programming.
You can also view a rejected promise as something similar to an exception and as such something that does not fit with functional programming.
If your view is the latter you can use the `no-promise-reject` rule to disallow rejected promises.

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

  return yv === 0 ? new Error("Cannot divide by zero.") : xv / yv;
}
```
