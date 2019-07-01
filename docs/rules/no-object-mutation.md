### no-object-mutation

[![Type Info Required][type-info-badge]][type-info-url]

This rule prohibits syntax that mutates existing objects via assignment to or deletion of their properties. While requiring the `readonly` modifier forces declared types to be immutable, it won't stop assignment into or modification of untyped objects or external types declared under different rules. Forbidding forms like `a.b = 'c'` is one way to plug this hole. Inspired by the no-mutation rule of [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

```typescript
const x = { a: 1 };

x.foo = "bar"; // <- Modifying properties of existing object not allowed.
x.a += 1; // <- Modifying properties of existing object not allowed.
delete x.a; // <- Modifying properties of existing object not allowed.
Object.assign(x, { b: 2 }); // <- Modifying properties of existing object not allowed.
```

#### Has Fixer

No

#### Options

- [ignore-prefix](#using-the-ignore-prefix-option)
- [ignore-suffix](#using-the-ignore-suffix-option)
- [ignore-pattern](#using-the-ignore-pattern-option)

#### Example config

```javascript
"no-object-mutation": true
```

```javascript
"no-object-mutation": [true, {"ignore-prefix": "mutable"}]
```
