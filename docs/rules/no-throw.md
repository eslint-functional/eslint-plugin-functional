### no-throw

Exceptions are not part of functional programming.

```typescript
throw new Error("Something went wrong."); // Unexpected throw, throwing exceptions is not functional.
```

As an alternative a function should return an error:

```typescript
function divide(x: number, y: number): number | Error {
  return y === 0 ? new Error("Cannot divide by zero.") : x / y;
}
```

Or in the case of an async function, a rejected promise should be returned.

```typescript
async function divide(x: Promise<number>, y: Promise<number>): Promise<number> {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```
