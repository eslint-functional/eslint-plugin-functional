# Prefer property signatures over method signatures (`functional/prefer-property-signatures`)

💼 This rule is enabled in the 🎨 `stylistic` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

## Rule Details

There are two ways function members can be declared in interfaces and type aliases; `MethodSignature` and `PropertySignature`.

The `MethodSignature` and the `PropertySignature` forms seem equivalent, but only the `PropertySignature` form can have a `readonly` modifier.
Because of this any `MethodSignature` will be mutable unless wrapped in the `Readonly` type.

It should be noted however that the `PropertySignature` form does not support overloading.

### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-property-signatures: "error" */

type Foo = {
  bar(): string;
};
```

### ✅ Correct

<!-- eslint-disable @typescript-eslint/no-redeclare -->

```ts
/* eslint functional/prefer-property-signatures: "error" */

type Foo = {
  bar: () => string;
};

type Foo = {
  readonly bar: () => string;
};
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignoreIfReadonlyWrapped: boolean;
};
```

### Default Options

```ts
const defaults = {
  ignoreIfReadonlyWrapped: false,
};
```

### `ignoreIfReadonlyWrapped`

If set to `true`, method signatures wrapped in the `Readonly` type will not be flagged as violations.

#### ✅ Correct

```ts
/* eslint functional/prefer-property-signatures: ["error", { "ignoreIfReadonlyWrapped": true } ] */

type Foo = Readonly<{
  bar(): string;
}>;
```
