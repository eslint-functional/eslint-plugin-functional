<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Disallow imperative loops (`functional/no-loop-statements`)

💼 This rule is enabled in the following configs: ☑️ `lite`, `noStatements`, ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

This rule disallows for loop statements, including `for`, `for...of`, `for...in`, `while`, and `do...while`.

## Rule Details

In functional programming we want everything to be an expression that returns a value.
Loops in JavaScript are statements so they are not a good fit for a functional programming style.
Instead consider using `map`, `reduce` or similar.
For more background see this
[blog post](https://hackernoon.com/rethinking-javascript-death-of-the-for-loop-c431564c84a8) and discussion in
[tslint-immutable #54](https://github.com/jonaskello/tslint-immutable/issues/54).

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-loop-statements: "error" */

const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double[i] = numbers[i] * 2;
}
```

<!-- eslint-skip -->

```js
/* eslint functional/no-loop-statements: "error" */

const numbers = [1, 2, 3];
let sum = 0;
for (const number of numbers) {
  sum += number;
}
```

### ✅ Correct

```js
/* eslint functional/no-loop-statements: "error" */
const numbers = [1, 2, 3];
const double = numbers.map((n) => n * 2);
```

```js
/* eslint functional/no-loop-statements: "error" */

const numbers = [1, 2, 3];
const sum = numbers.reduce((carry, number) => carry + number, 0);
```
