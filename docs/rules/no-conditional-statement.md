# Disallow conditional statements (no-conditional-statement)

This rule disallows conditional statements such as if and switch.

## Rule Details

Conditional statements are not a good fit for functional style programming as they are not expressions and do not return a value.

```typescript
let x;
if (i === 1) {
  x = 2;
} else {
  x = 3;
}
```

Instead consider using the [tenary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) which is an expression that returns a value:

```typescript
const x = i === 1 ? 2 : 3;
```

For more background see this [blog post](https://hackernoon.com/rethinking-javascript-the-if-statement-b158a61cd6cb) and discussion in [#54](https://github.com/jonaskello/tslint-immutable/issues/54).

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly allowReturningBranches: boolean | "onlyIfExhaustive";
};

const defaults = {
  allowReturningBranches: false
};
```

### `allowReturningBranches`

#### `true`

The optional allows conditional statements but only if all defined branches end with a return statement.
This allows early escapes to be used.

```typescript
function foo(error, data) {
  if (error) {
    return;
  }

  // ... - Do stuff with data.
}
```

#### `"onlyIfExhaustive"`

This will only allow conditional statements to exists if every case is taken it to account and each has a return statement.
In other works, every if must have an else and every switch must have a default case.
This allows conditional statements to be used like [do expressions](https://github.com/tc39/proposal-do-expressions).

```typescript
const x = (() => {
  switch(y) {
    case "a":
      return 1;
    case "b":
      return 2;
    default:
      return 0;
})();
```

Note: Currently this option is not useable with the [no-else-return](https://eslint.org/docs/rules/no-else-return) rule; else statements must contain a return statement.
