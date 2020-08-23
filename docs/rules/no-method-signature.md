# Prefer property signatures with readonly modifiers over method signatures (no-method-signature)

Prefer property signatures with readonly modifiers over method signatures.

## Rule Details

There are two ways function members can be declared in interfaces and type aliases; `MethodSignature` and `PropertySignature`.

The `MethodSignature` and the `PropertySignature` forms seem equivalent, but only the `PropertySignature` form can have a `readonly` modifier.
Because of this any `MethodSignature` will be mutable. Therefore the `no-method-signature` rule disallows usage of this form and instead proposes to use the `PropertySignature` which can have a `readonly` modifier.
It should be noted however that the `PropertySignature` form for declaring functions does not support overloading.

Examples of **incorrect** code for this rule:

```ts
/* eslint functional/no-method-signature: "error" */

type Foo = {
  bar(): string;
};
```

Examples of **correct** code for this rule:

```ts
/* eslint functional/no-method-signature: "error" */

type Foo = {
  readonly bar: () => string;
};
```

## Options

The rule does not accept any options.
