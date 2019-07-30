# Disallow try-catch[-finally] and try-finally patterns (no-try-statement)

This rule disallows the `try` keyword.

## Rule Details

Try statements are not part of functional programming. See [no-throw-statement](./no-throw-statement.md) for more information.

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly allowCatch: boolean;
  readonly allowFinally: boolean;
};

const defaults = {
  allowCatch: false,
  allowFinally: false
};
```

### `allowCatch`

If true, try-catch statements are allowed.

### `allowFinally`

If true, try-finally statements are allowed.
