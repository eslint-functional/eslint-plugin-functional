<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# functional/no-expression-statements

📝 Disallow expression statements.

💼🚫 This rule is enabled in the following configs: ![badge-noStatements](https://img.shields.io/badge/-noStatements-purple.svg) `noStatements`, ✅ `recommended`, 🔒 `strict`. This rule is _disabled_ in the following configs: ![badge-disableTypeChecked](https://img.shields.io/badge/-disableTypeChecked-navy.svg) `disableTypeChecked`, ☑️ `lite`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free
(pure) functions.

## Rule Details

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect.
e.g.

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

```js
/* eslint functional/no-expression-statements: ["error", { "ignoreVoid": true }] */

console.log("hello world");
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignoreCodePattern?: string[] | string;
  ignoreVoid?: boolean;
  ignoreSelfReturning?: boolean;
};
```

### Default Options

```ts
const defaults = {
  ignoreVoid: false,
  ignoreSelfReturning: false,
};
```

### `ignoreVoid`

When enabled, expression of type `void` and `Promise<void>` are not flagged as violations.
This options requires TypeScript in order to work.

### `ignoreSelfReturning`

Like `ignoreVoid` but instead does not flag function calls that always only return `this`.

Limitation: The function declaration must explicitly use `return this`; equivalents
(such as assign this to a variable first, that is then returned) won't be considered valid.

### `ignoreCodePattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on the code itself.
