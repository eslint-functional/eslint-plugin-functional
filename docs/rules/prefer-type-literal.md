# Prefer type over interface (prefer-type-literal)

This rule enforces use of the type literals over interfaces.

## Rule Details

Interfaces are part of Object Oriented Design.
When it comes to functional design, types should be used instead.

Examples of **incorrect** code for this rule:

```ts
/* eslint functional/prefer-type-literal: "error" */

interface Foo {
  bar: string;
}
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/prefer-type-literal: "error" */

type Foo = {
  bar: string;
};
```

## Options

This rule accepts an options object of the following type:

```ts
{
  ignorePattern?: string | Array<string>;
}
```

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
