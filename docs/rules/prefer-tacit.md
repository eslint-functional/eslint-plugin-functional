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
  assumeTypes: boolean;
  ignorePattern?: string[] | string;
};
```

### Default Options

```ts
const defaults = {
  assumeTypes: false,
};
```

### `assumeTypes`

The rule takes advantage of TypeScript's typing engine to check if callback wrapper is in fact safe to remove.

This option will make the rule assume that the function only accepts the arguments given to it in the wrapper.
However this may result in some false positives being picked up.

<!-- eslint-disable functional/prefer-tacit -->

```js
const foo = (x) => f(x); // If `f` only accepts one parameter then this is violation of the rule.
const bar = foo(1, 2, 3); // But if `f` accepts more than one parameter then it isn't.
```

Note: Enabling this option is the only way to get this rule to report violations in an environment without TypeScript's typing engine available (e.g. In Vanilla JS).

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
