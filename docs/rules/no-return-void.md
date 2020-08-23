# Disallow Returning Nothing (no-return-void)

Disallow functions that are declared as returning nothing.

## Rule Details

In functional programming functions must return something, they cannot return nothing.

By default, this rule allows function to return `undefined` and `null`.

Note: For performance reasons, this rule does not check implicit return types.
We recommend using the rule [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) in conjunction with this rule.

Examples of **incorrect** code for this rule:

```ts
/* eslint functional/no-return-void: "error" */

function updateText(): void {

}
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/no-return-void: "error" */

function updateText(value: string): string {

}
```

## Options

This rule accepts an options object of the following type:

```ts
{
  allowNull: boolean;
  allowUndefined: boolean;
}
```

The default options:

```ts
{
  allowNull: true,
  allowUndefined: true
}
```

### allowNull

If true allow returning null.

### allowUndefined

If true allow returning undefined.
