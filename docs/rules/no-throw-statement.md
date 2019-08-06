# Disallow throwing exceptions (no-throw-statement)

This rule disallows the `throw` keyword.

## Rule Details

Exceptions are not part of functional programming.

```ts
throw new Error("Something went wrong."); // Unexpected throw, throwing exceptions is not functional.
```

As an alternative a function should return an error:

```ts
function divide(x: number, y: number): number | Error {
  return y === 0 ? new Error("Cannot divide by zero.") : x / y;
}
```

Or in the case of an async function, a rejected promise should be returned.

```ts
async function divide(x: Promise<number>, y: Promise<number>): Promise<number> {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```

## Options

The rule does not accept any options.
