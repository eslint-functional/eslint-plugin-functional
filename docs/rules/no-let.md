# Disallow mutable variables (no-let)

This rule should be combined with tslint's built-in `no-var-keyword` rule to enforce that all variables are declared as `const`.

## Rule Details

There's no reason to use `let` in a Redux/React application, because all your state is managed by either Redux or React. Use `const` instead, and avoid state bugs altogether.

```ts
let x = 5; // <- Unexpected let or var, use const.
```

What about `for` loops? Loops can be replaced with the Array methods like `map`, `filter`, and so on. If you find the built-in JS Array methods lacking, use [ramda](http://ramdajs.com/), or [lodash-fp](https://github.com/lodash/lodash/wiki/FP-Guide).

```ts
const SearchResults = ({ results }) => (
  <ul>
    {results.map(result => (
      <li>result</li>
    )) // <- Who needs let?
    }
  </ul>
);
```

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  allowLocalMutation: boolean;
  ignorePattern?: string | Array<string>;
};

const defaults = {
  allowLocalMutation: false
};
```

### `allowLocalMutation`

See the [allowLocalMutation](./options/allow-local-mutation.md) docs.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
