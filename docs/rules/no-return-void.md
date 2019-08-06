# Disallow Returning Nothing (no-return-void)

Disallow functions that are declared as returning nothing.

## Rule Details

In functional programming functions must return something, they cannot return nothing.

By default, this rule allows function to return `undefined` and `null`.

Note: For performance reasons, this rule does not check implicit return types. We recommend using the rule [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) in conjunction with this rule.

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  allowNull: boolean;
  allowUndefined: boolean;
};

const defaults: Options = {
  allowNull: true,
  allowUndefined: true
};
```

### allowNull

If true allow returning null.

### allowUndefined

If true allow returning undefined.
