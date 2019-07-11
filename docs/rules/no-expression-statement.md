# Using expressions to cause side-effects not allowed (no-expression-statement)

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

## Rule Details

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

```typescript
array.push(1);
alert("Hello world!");
```

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly ignorePattern?: string | Array<string>;
};

const defaults = {};
```

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
