# Disallow this access (no-this-expressions)

## Rule Details

This rule is companion rule to the [no-classes](./no-classes.md) rule.
See the its docs for more info.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-this-expressions: "error" */

const foo = this.value + 17;
```

### ✅ Correct

```js
/* eslint functional/no-this-expressions: "error" */

const foo = object.value + 17;
```

## Options

The rule does not accept any options.
