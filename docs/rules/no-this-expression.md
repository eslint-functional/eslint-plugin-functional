# Disallow this access (no-this-expression)

## Rule Details

This rule is companion rule to the [no-class](./no-class.md) rule.
See the its docs for more info.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-this-expression: "error" */

const foo = this.value + 17;
```

### ✅ Correct

```js
/* eslint functional/no-this-expression: "error" */

const foo = object.value + 17;
```

## Options

The rule does not accept any options.
