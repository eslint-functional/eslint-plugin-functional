# Prefer property signatures over method signatures (prefer-property-signatures)

## Rule Details

There are two ways function members can be declared in interfaces and type aliases; `MethodSignature` and `PropertySignature`.

The `MethodSignature` and the `PropertySignature` forms seem equivalent, but only the `PropertySignature` form can have a `readonly` modifier.
Because of this any `MethodSignature` will be mutable unless wrapped in the `Readonly` type.

It should be noted however that the `PropertySignature` form for declaring functions does not support overloading.

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
  readonly bar: () => string;
};

type Foo = Readonly<{
  bar(): string;
}>;
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignoreIfReadonly: boolean;
}
```

### Default Options

```ts
const defaults = {
  ignoreIfReadonly: true
}
```

### `ignoreIfReadonly`

If set to `false`, this option allows for the use of method signatures if they are wrapped in the `Readonly` type.

#### ❌ Incorrect

<!-- eslint-skip -->

```ts
/* eslint functional/prefer-property-signatures: ["error", { "ignoreIfReadonly": false } ] */

type Foo = Readonly<{
  bar(): string;
}>;
```
