# Disallow mutable variables (no-let)

This rule should be combined with tslint's built-in `no-var-keyword` rule to enforce that all variables are declared as `const`.

## Rule Details

In functional programming variables should not be mutable; use `const` instead.

```ts
let x = 5; // <- Unexpected let, use const.
```

What about `for` loops? Loops can be replaced with the Array methods like `map`, `filter`, and so on.
If you find the built-in JS Array methods lacking, you could use a 3rd-party library like [ramda](http://ramdajs.com/), or [lodash-fp](https://github.com/lodash/lodash/wiki/FP-Guide).

```jsx
const SearchResults = ({ results }) => (
  <ul>
    { results.map(result => (
      <li>result</li>
    )) } // <- Who needs let?
  </ul>
);
```

## Options

This rule accepts an options object of the following type:

```ts
{
  allowLocalMutation: boolean;
  ignorePattern?: string | Array<string>;
}
```

The default options:

```ts
{
  allowLocalMutation: false
}
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

Patterns will be matched against variable names.
See the [ignorePattern](./options/ignore-pattern.md) docs.
