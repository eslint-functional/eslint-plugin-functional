<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Disallow conditional statements (`functional/no-conditional-statements`)

💼🚫 This rule is enabled in the following configs: `noStatements`, ✅ `recommended`, 🔒 `strict`. This rule is _disabled_ in the following configs: `disableTypeChecked`, ☑️ `lite`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

This rule disallows conditional statements such as `if` and `switch`.

## Rule Details

Conditional statements are not a good fit for functional style programming as they are not expressions and do not return
a value. Instead consider using the
[ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
which is an expression that returns a value:

For more background see this [blog post](https://hackernoon.com/rethinking-javascript-the-if-statement-b158a61cd6cb)
and discussion in [tslint-immutable #54](https://github.com/jonaskello/tslint-immutable/issues/54).

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-conditional-statements: "error" */

let x;
if (i === 1) {
  x = 2;
} else {
  x = 3;
}
```

### ✅ Correct

```js
/* eslint functional/no-conditional-statements: "error" */

const x = i === 1 ? 2 : 3;
```

```js
/* eslint functional/no-conditional-statements: "error" */

function foo(x, y) {
  return x === y // if
    ? 0
    : x > y // else if
      ? 1
      : -1; // else
}
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowReturningBranches: boolean | "ifExhaustive";
  ignoreCodePattern?: ReadonlyArray<string> | string;
};
```

### Default Options

```ts
const defaults = {
  allowReturningBranches: false,
};
```

### Preset Overrides

#### `recommended` and `lite`

```ts
const recommendedAndLiteOptions = {
  allowReturningBranches: true,
};
```

### `allowReturningBranches`

#### `true`

Allows conditional statements but only if all defined branches end with a return statement or other terminal.
This allows early escapes to be used.

```js
function foo(error, data) {
  if (error) {
    return;
  }

  // ... - Do stuff with data.
}
```

#### `"ifExhaustive"`

This will only allow conditional statements to exist if every case is taken into account and each has a return statement
or other terminal. In other words, every `if` must have an `else` and every `switch` must have a default case.
This allows conditional statements to be used like [do expressions](https://github.com/tc39/proposal-do-expressions).

```js
const x = (() => {
  switch (y) {
    case "a":
      return 1;
    case "b":
      return 2;
    default:
      return 0;
  }
})();
```

Note: Currently this option is not useable with the [no-else-return](https://eslint.org/docs/rules/no-else-return) rule;
`else` statements must contain a return statement.

### `ignoreCodePattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on the test condition of the `if`
statement.

Note: This option has no effect on `switch` statements.
