# Disallow rejecting Promises (no-promise-reject)

This rule disallows use of `Promise.reject()`.

We don't recommend this rule but it's there for those who want it.

## Rule Details

You can view a `Promise` as a result object with built-in error (something like `{ value: T } | { error: Error }`) in which case a rejected `Promise` can be viewed as a returned result and thus fits with functional programming.
You can also view a rejected promise as something similar to an exception and as such something that does not fit with functional programming.
If your view is the latter you can use the `no-promise-reject` rule to disallow rejected promises.

Examples of **incorrect** code for this rule:

```js
/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? new Error("Cannot divide by zero.")
    : xv / yv;
}
```

## Options

The rule does not accept any options.
