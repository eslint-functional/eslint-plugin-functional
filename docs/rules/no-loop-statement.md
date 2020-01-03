# Disallow imperative loops (no-loop-statement)

This rule disallows for loop statements, including `for`, `for...of`, `for...in`, `while`, and `do...while`.

## Rule Details

In functional programming we want everthing to be an expression that returns a value.
Loops in JavaScript are statements so they are not a good fit for a functional programming style.

```ts
const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double[i] = numbers[i] * 2;
}
```

Instead consider using `map` or `reduce`:

```ts
const numbers = [1, 2, 3];
const double = numbers.map(n => n * 2);
```

For more background see this [blog post](https://hackernoon.com/rethinking-javascript-death-of-the-for-loop-c431564c84a8) and discussion in [tslint-immutable #54](https://github.com/jonaskello/tslint-immutable/issues/54).

## Options

The rule does not accept any options.
