### no-let

This rule should be combined with tslint's built-in `no-var-keyword` rule to enforce that all variables are declared as `const`.

There's no reason to use `let` in a Redux/React application, because all your state is managed by either Redux or React. Use `const` instead, and avoid state bugs altogether.

```typescript
let x = 5; // <- Unexpected let or var, use const.
```

What about `for` loops? Loops can be replaced with the Array methods like `map`, `filter`, and so on. If you find the built-in JS Array methods lacking, use [ramda](http://ramdajs.com/), or [lodash-fp](https://github.com/lodash/lodash/wiki/FP-Guide).

```typescript
const SearchResults = ({ results }) => (
  <ul>
    {results.map(result => (
      <li>result</li>
    )) // <- Who needs let?
    }
  </ul>
);
```

#### Has Fixer

Yes

#### Options

- [ignore-local](#using-the-ignore-local-option)
- [ignore-prefix](#using-the-ignore-prefix-option)
- [ignore-suffix](#using-the-ignore-suffix-option)
- [ignore-pattern](#using-the-ignore-pattern-option)

#### Example config

```javascript
"no-let": true
```

```javascript
"no-let": [true, "ignore-local"]
```

```javascript
"no-let": [true, "ignore-local", {"ignore-prefix": "mutable"}]
```
