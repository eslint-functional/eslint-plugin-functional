# Prefer type over interface (prefer-type-literal)

This rule enforces use of the type literals over interfaces.

## Rule Details

Interfaces are part of Object Oriented Design. When it comes to functional design, types should be used instead.

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  readonly allowLocalMutation?: boolean;
  readonly ignorePattern?: string | Array<string>;
};

const defaults = {
  allowLocalMutation: false,
};
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
