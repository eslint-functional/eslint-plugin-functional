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

The rule does not accept any options.
