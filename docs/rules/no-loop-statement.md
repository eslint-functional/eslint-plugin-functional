# Disallow imperative loops (no-loop-statement)

This rule disallows for loop statements, including `for`, `for...of`, `for...in`, `while`, and `do...while`.

## Rule Details

In functional programming we want everything to be an expression that returns a value.
Loops in JavaScript are statements so they are not a good fit for a functional programming style.
Instead consider using `map`, `reduce` or similar.
For more background see this [blog post](https://hackernoon.com/rethinking-javascript-death-of-the-for-loop-c431564c84a8) and discussion in [tslint-immutable #54](https://github.com/jonaskello/tslint-immutable/issues/54).

Examples of **incorrect** code for this rule:

```js
/* eslint functional/no-loop-statement: "error" */

const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double[i] = numbers[i] * 2;
}
```

```js
/* eslint functional/no-loop-statement: "error" */

const numbers = [1, 2, 3];
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-loop-statement: "error" */
const numbers = [1, 2, 3];
const double = numbers.map((n) => n * 2);
```

```js
/* eslint functional/no-loop-statement: "error" */

const numbers = [1, 2, 3];
const sum = numbers.reduce((carry, number) => carry + number, 0);
```

## Options

The rule does not accept any options.
