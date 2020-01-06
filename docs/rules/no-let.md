# Disallow mutable variables (no-let)

This rule should be combined with tslint's built-in `no-var-keyword` rule to enforce that all variables are declared as `const`.

## Rule Details

In functional programming variables should not be mutable; use `const` instead.

Examples of **incorrect** code for this rule:

```js
/* eslint functional/no-let: "error" */

let x = 5;
```

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
{
  allowLocalMutation: boolean;
  ignorePattern?: string | Array<string>;
}
```

The default options:

```ts
{
  allowLocalMutation: false
}
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

Patterns will be matched against variable names.
See the [ignorePattern](./options/ignore-pattern.md) docs.
