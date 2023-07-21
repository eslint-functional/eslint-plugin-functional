# Disallow mutable variables (`functional/no-let`)

💼 This rule is enabled in the following configs: ☑️ `lite`, `no-mutations`, ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule should be combined with ESLint's built-in `no-var` rule to enforce that all variables are declared as `const`.

## Rule Details

In functional programming variables should not be mutable; use `const` instead.

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

let x = 5;
```

<!-- eslint-skip -->

```js
/* eslint functional/no-let: "error" */

for (let i = 0; i < array.length; i++) {}
```

### ✅ Correct

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
  allowInFunctions: boolean;
  ignoreIdentifierPattern?: string[] | string;
};
```

### Default Options

```ts
const defaults = {
  allowInForLoopInit: false,
  allowInFunctions: false,
};
```

### Preset Overrides

#### `recommended` and `lite`

```ts
const recommendedAndLiteOptions = {
  allowInForLoopInit: true,
};
```

### `allowInForLoopInit`

If set, `let`s inside of for a loop initializer are allowed. This does not include for...of or for...in loops as they should use `const` instead.

#### ✅ Correct

<!-- eslint-disable @typescript-eslint/prefer-for-of -->

```js
/* eslint functional/no-let: ["error", { "allowInForLoopInit": true } ] */

for (let i = 0; i < array.length; i++) {}
```

#### ❌ Incorrect

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

### `allowInFunctions`

If true, the rule will not flag any statements that are inside of function bodies.

### `ignoreIdentifierPattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on a variable's name.
