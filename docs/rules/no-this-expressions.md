<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Disallow this access (`functional/no-this-expressions`)

💼🚫 This rule is enabled in the following configs: `noOtherParadigms`, 🔒 `strict`. This rule is _disabled_ in the following configs: ☑️ `lite`, ✅ `recommended`.

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

## Rule Details

This rule is a companion rule to the [no-classes](./no-classes.md) rule.
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
