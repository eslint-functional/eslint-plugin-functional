# Prefer property signatures with readonly modifiers over method signatures (no-method-signature)

Prefer property signatures with readonly modifiers over method signatures.

## Rule Details

There are two ways function members can be declared in an interface or type alias:

```typescript
interface Zoo {
  foo(): string; // MethodSignature, cannot have readonly modifier
  readonly bar: () => string; // PropertySignature
}
```

The `MethodSignature` and the `PropertySignature` forms seem equivalent, but only the `PropertySignature` form can have a `readonly` modifier. Becuase of this any `MethodSignature` will be mutable. Therefore the `no-method-signature` rule disallows usage of this form and instead proposes to use the `PropertySignature` which can have a `readonly` modifier. It should be noted however that the `PropertySignature` form for declaring functions does not support overloading.

## Options

The rule does not accept any options.
