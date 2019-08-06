# Disallow try-catch[-finally] and try-finally patterns (no-promise-reject)

This rule disallows `Promise.reject()`.

## Rule Details

You can view a `Promise` as a result object with built-in error (something like `{ value: T } | { error: Error }`) in which case a rejected `Promise` can be viewed as a returned result and thus fits with functional programming. You can also view a rejected promise as something similar to an exception and as such something that does not fit with functional programming. If your view is the latter you can use the `no-promise-reject` rule to disallow rejected promises.

```ts
async function divide(
  x: Promise<number>,
  y: Promise<number>
): Promise<number | Error> {
  const [xv, yv] = await Promise.all([x, y]);

  // Rejecting the promise is not allowed so resolve to an Error instead

  // return yv === 0
  //   ? Promise.reject(new Error("Cannot divide by zero."))
  //   : xv / yv;

  return yv === 0 ? new Error("Cannot divide by zero.") : xv / yv;
}
```

## Options

The rule does not accept any options.
