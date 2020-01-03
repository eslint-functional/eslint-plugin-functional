# Prefer type over interface (prefer-type-literal)

This rule enforces use of the type literals over interfaces.

## Rule Details

Interfaces are part of Object Oriented Design.
When it comes to functional design, types should be used instead.

## Options

This rule accepts an options object of the following type:

```ts
{
  allowLocalMutation?: boolean;
  ignorePattern?: string | Array<string>;
}
```

The default options:

```ts
{
  allowLocalMutation: false,
}
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
