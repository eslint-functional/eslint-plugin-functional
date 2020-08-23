# Disallow throwing exceptions (no-throw-statement)

This rule disallows the `throw` keyword.

## Rule Details

Exceptions are not part of functional programming.
As an alternative a function should return an error or in the case of an async function, a rejected promise.

Examples of **incorrect** code for this rule:

```js
/* eslint functional/no-throw-statement: "error" */

throw new Error("Something went wrong.");
```

Examples of **correct** code for this rule:

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

The rule does not accept any options.
