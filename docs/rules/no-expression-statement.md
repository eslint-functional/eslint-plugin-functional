# Using expressions to cause side-effects not allowed (no-expression-statement)

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

## Rule Details

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

```js
array.push(1);          // This statement performs a side-effect.
alert("Hello world!");  // This statement performs a side-effect.
```

## Options

This rule accepts an options object of the following type:

```ts
{
  ignorePattern?: string | Array<string>;
}
```

The default options:

```ts
{
}
```

### `ignorePattern`

Patterns will be matched against the line(s) of code.
See the [ignorePattern](./options/ignore-pattern.md) docs for more infomation.
