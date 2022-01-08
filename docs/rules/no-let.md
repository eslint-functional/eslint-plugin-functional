# Disallow mutable variables (no-let)

This rule should be combined with ESLint's built-in `no-var` rule to enforce that all variables are declared as `const`.

## Rule Details

In functional programming variables should not be mutable; use `const` instead.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

let x = 5;
```

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

for (let i = 0; i < array.length; i++) {
}
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-let: "error" */

const x = 5;
```

```js
/* eslint functional/no-let: "error" */

for (const element of array) {
}
```

```js
/* eslint functional/no-let: "error" */

for (const [index, element] of array.entries()) {
}
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowLocalMutation: boolean;
  ignorePattern?: string[] | string;
}
```

The default options:

```ts
const defaults = {
  allowInForLoopInit: false,
  allowLocalMutation: false
}
```

### `allowInForLoopInit`

If set, `let`s inside of for a loop initializer are allowed. This does not include for...of or for...in loops.

Examples of **correct** code for this rule:

```js
/* eslint functional/no-let: ["error", { "allowInForLoopInit": true } ] */

for (let i = 0; i < array.length; i++) {
}
```

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

for (let element of array) {
}
```

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

for (let [index, element] of array.entries()) {
}
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

Patterns will be matched against variable names.
See the [ignorePattern](./options/ignore-pattern.md) docs.
