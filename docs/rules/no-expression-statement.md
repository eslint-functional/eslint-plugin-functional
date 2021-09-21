# Using expressions to cause side-effects not allowed (no-expression-statement)

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

## Rule Details

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statement: "error" */

console.log("Hello world!");
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statement: "error" */

array.push(3);
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statement: "error" */

foo(bar);
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-expression-statement: "error" */

const baz = foo(bar);
```

<!-- eslint-skip -->

```js
/* eslint functional/no-expression-statement: ["error", { "ignoreVoid": true }] */

console.log("hello world");
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignorePattern?: string[] | string;
  ignoreVoid?: boolean
}
```

The default options:

```ts
const defaults = {
  ignoreVoid: false
}
```

### `ignoreVoid`

When enabled, expression of type void are not flagged as violations. This options requires TypeScript in order to work.

### `ignorePattern`

Patterns will be matched against the line(s) of code.
See the [ignorePattern](./options/ignore-pattern.md) docs for more information.
