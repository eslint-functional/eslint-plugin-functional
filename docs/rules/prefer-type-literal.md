# Prefer type over interface (prefer-type-literal)

This rule enforces use of the type literals over interfaces.

## Rule Details

Interfaces are part of Object Oriented Design. When it comes to functional design, types should be used instead.

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly ignoreLocal?: boolean;
  readonly ignorePattern?: string | Array<string>;
};

const defaults = {
  ignoreLocal: false,
};
```

### `ignoreLocal`

See the [ignoreLocal](./options/ignore-local.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
