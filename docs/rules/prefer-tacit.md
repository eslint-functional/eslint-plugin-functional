# Replaces `x => f(x)` with just `f` (`functional/prefer-tacit`)

⚠️ This rule _warns_ in the 🎨 `stylistic` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

This rule enforces using functions directly if they can be without wrapping them.

## Rule Details

Generally there's no reason to wrap a function with a callback wrapper if it's directly called anyway.
Doing so creates extra inline lambdas that slow the runtime down.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  // ...
}

const foo = (x) => f(x);
```

### ✅ Correct

```ts
/* eslint functional/prefer-tacit: "error" */

function f(x) {
  // ...
}

const foo = f;
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignorePattern?: string[] | string;
};
```

### Default Options

```ts
const defaults = {};
```

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
