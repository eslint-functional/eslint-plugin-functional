# Disallow expression statements (`functional/no-expression-statements`)

💼🚫 This rule is enabled in the following configs: `no-statements`, ✅ `recommended`, 🔒 `strict`. This rule is _disabled_ in the ☑️ `lite` config.

<!-- end auto-generated rule header -->

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

## Rule Details

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statements: "error" */

console.log("Hello world!");
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statements: "error" */

array.push(3);
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statements: "error" */

foo(bar);
```

### ✅ Correct

```js
/* eslint functional/no-expression-statements: "error" */

const baz = foo(bar);
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statements: ["error", { "ignoreVoid": true }] */

console.log("hello world");
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignorePattern?: string[] | string;
  ignoreVoid?: boolean;
};
```

### Default Options

```ts
const defaults = {
  ignoreVoid: false,
};
```

### `ignoreVoid`

When enabled, expression of type void are not flagged as violations. This options requires TypeScript in order to work.

### `ignorePattern`

Patterns will be matched against the line(s) of code.
See the [ignorePattern](./options/ignore-pattern.md) docs for more information.
