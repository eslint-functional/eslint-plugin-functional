# Disallow functions that don't return anything (`functional/no-return-void`)

💼 This rule is enabled in the following configs: ☑️ `lite`, `no-statements`, ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

Disallow functions that are declared as returning nothing.

## Rule Details

In functional programming functions must return something, they cannot return nothing.

By default, this rule allows function to return `undefined` and `null`.

Note: For performance reasons, this rule does not check implicit return types.
We recommend using the rule [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) in conjunction with this rule.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/no-return-void: "error" */

function updateText(): void {}
```

### ✅ Correct

```ts
/* eslint functional/no-return-void: "error" */

function updateText(value: string): string {}
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowNull: boolean;
  allowUndefined: boolean;
  ignoreInferredTypes: boolean;
};
```

### Default Options

```ts
const defaults = {
  allowNull: true,
  allowUndefined: true,
  ignoreInferredTypes: false,
};
```

### `allowNull`

If true allow returning null.

### `allowUndefined`

If true allow returning undefined.

### `ignoreInferredTypes`

If true ignore functions that don't explicitly specify a return type.
