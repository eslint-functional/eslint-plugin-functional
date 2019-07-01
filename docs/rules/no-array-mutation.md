### no-array-mutation

[![Type Info Required][type-info-badge]][type-info-url]

This rule prohibits mutating an array via assignment to or deletion of their elements/properties. This rule enforces array immutability without the use of `ReadonlyArray<T>` (as apposed to [readonly-array](#readonly-array)).

```typescript
const x = [0, 1, 2];

x[0] = 4; // <- Mutating an array is not allowed.
x.length = 1; // <- Mutating an array is not allowed.
x.push(3); // <- Mutating an array is not allowed.
```

#### Has Fixer

No

#### Options

- [ignore-prefix](#using-the-ignore-prefix-option)
- [ignore-suffix](#using-the-ignore-suffix-option)
- [ignore-pattern](#using-the-ignore-pattern-option)
- [ignore-new-array](#using-the-ignore-new-array-option-with-no-array-mutation)
- ~~ignore-mutation-following-accessor~~ - _deprecated in favor of [ignore-new-array](#using-the-ignore-new-array-option-with-no-array-mutation)_

#### Example config

```javascript
"no-array-mutation": true
```

```javascript
"no-array-mutation": [true, {"ignore-prefix": "mutable"}]
```

```javascript
"no-array-mutation": [true, "ignore-new-array"]
```
