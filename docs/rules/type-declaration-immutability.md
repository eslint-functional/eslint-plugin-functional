# Enforce a level of immutability for type declaration (type-declaration-immutability)

Require type alias declarations and interfaces that imply some level of
immutability to comply to it.

## Rule Details

This rule enforces rules on type immutability based on the type's name.

For details on what the different levels of immutability mean, see [the
immutability
section](https://github.com/RebeccaStevens/is-immutable-type#immutability) of
[is-immutable-type](https://www.npmjs.com/package/is-immutable-type).

### ❌ Incorrect

<!-- eslint-disable functional/type-declaration-immutability -->

```ts
/* eslint functional/type-declaration-immutability: "error" */

type ReadonlyElement = {
  id: number;
  data: string[];
};

type ReadonlyDeepElement = Readonly<{
  id: number;
  data: string[];
}>;

type MutableElement = Readonly<{
  id: number;
  data: ReadonlyArray<string>;
}>;
```

### ✅ Correct

<!-- eslint-disable functional/type-declaration-immutability -->

```ts
/* eslint functional/type-declaration-immutability: "error" */

type ReadonlyElement = Readonly<{
  id: number;
  data: string[];
}>;

type ReadonlyDeepElement = Readonly<{
  id: number;
  data: ReadonlyArray<string>;
}>;

type MutableElement = {
  readonly id: number;
  data: ReadonlyArray<string>;
};
```

## Settings

This rule can leverage shared settings to configure immutability settings.

See the [immutability](./settings/immutability.md) docs.

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  rules: Array<{
    identifiers: string | string[];
    immutability:  "Mutable" | "ReadonlyShallow" | "ReadonlyDeep" | "Immutable";
    comparator?: "Less" | "AtMost" | "Exactly" | "AtLeast" | "More";
  }>;
  ignoreInterfaces: boolean;
  ignorePattern: string[] | string;
}
```

### Default Options

```ts
const defaults = {
  rules: [
    {
      identifiers: "^(?!I?Mutable).+",
      immutability: "Immutable",
      comparator: "AtLeast",
    },
  ],
  ignoreInterfaces: false,
}
```

### Preset Overrides

#### `recommended` and `lite`

```ts
const recommendedOptions = {
  rules: [
    {
      identifiers: "I?Immutable.+",
      immutability: "Immutable",
      comparator: "AtLeast",
    },
    {
      identifiers: "I?ReadonlyDeep.+",
      immutability: "ReadonlyDeep",
      comparator: "AtLeast",
    },
    {
      identifiers: "I?Readonly.+",
      immutability: "ReadonlyShallow",
      comparator: "AtLeast",
    },
    {
      identifiers: "I?Mutable.+",
      immutability: "Mutable",
      comparator: "AtMost",
    },
  ],
}
```

### `rules`

An array of rules to enforce immutability by.

These rules should be sorted by precedence as each type declaration will only
enforce the first matching rule to it.

#### `identifiers`

A regex pattern or an array of regex patterns that are used to match against the
name of the type declarations.

#### `immutability`

The level of immutability to compare against. This value will be compared to the
calculated immutability using the `comparator`.

#### `comparator`

The comparator to use to compare the calculated immutability to the desired
immutability. This can be thought of as `<`, `<=`, `==`, `>=` or `>`.

### `ignoreInterfaces`

A boolean to specify whether interfaces should be exempt from these rules.
`false` by default.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
