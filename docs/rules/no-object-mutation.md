# Disallow mutating objects (no-object-mutation)

This rule prohibits syntax that mutates existing objects via assignment to or deletion of their properties.

## Rule Details

While requiring the `readonly` modifier forces declared types to be immutable, it won't stop assignment into or modification of untyped objects or external types declared under different rules. Forbidding forms like `a.b = 'c'` is one way to plug this hole. Inspired by the no-mutation rule of [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

```typescript
const x = { a: 1 };

x.foo = "bar"; // <- Modifying properties of existing object not allowed.
x.a += 1; // <- Modifying properties of existing object not allowed.
delete x.a; // <- Modifying properties of existing object not allowed.
Object.assign(x, { b: 2 }); // <- Modifying properties of existing object not allowed.
```

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly ignorePattern?: string | Array<string>;
  readonly ignoreAccessorPattern?: string | Array<string>;
};

const defaults = {};
```

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.

### `ignoreAccessorPattern`

See the [ignoreAccessorPattern](./options/ignore-accessor-pattern.md) docs.
