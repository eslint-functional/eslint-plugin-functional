# Replaces `x => f(x)` with just `f` (`functional/prefer-tacit`)

⚠️ This rule _warns_ in the 🎨 `stylistic` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

This rule enforces using functions directly if they can be without wrapping them.

## Rule Details

If a function can be used directly without being in a callback wrapper, then it's generally better to use it directly.
Extra inline lambdas can slow the runtime down.

⚠️ Warning ⚠️: Use with caution as if not all parameters should be passed to the function, a wrapper function is then required.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  return x + 1;
}

const foo = [1, 2, 3].map((x) => f(x));
```

### ✅ Correct

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  return x + 1;
}

const foo = [1, 2, 3].map(f);
```
