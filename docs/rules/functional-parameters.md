# Enforce Functional Parameters (functional-parameters)

Disallow use of rest parameters, the `arguments` keyword and enforces that functions take a least 1 parameter.

## Rule Details

In function, `arguments` is a special variable that is implicitly available.
This variable is an array containing the arguments passed to the function call and is often used to allow for any number of parameters to be passed to a function.

Rest parameters are another way any number of parameters can be passed to a function.

When it comes to functional programming, it is better have known and explicit parameters.
Also of note: currying functions is a lot more difficult with an undefined number of parameters.

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  ignorePattern?: string | Array<string>;
  allowRestParameter: boolean;
  allowArgumentsKeyword: boolean;
  enforceParameterCount: false | "atLeastOne" | "exactlyOne" | {
    count: "atLeastOne" | "exactlyOne";
    ignoreIIFE: boolean;
  };
};

const defaults = {
  allowRestParameter: false,
  allowArgumentsKeyword: false,
  enforceParameterCount: {
    count: "atLeastOne",
    ignoreIIFE: true
  }
};
```

Note: the `lite` ruleset overrides the default options for this rule to:

```ts
{
  allowRestParameter: false,
  allowArgumentsKeyword: false,
  enforceParameterCount: false
}
```

### `allowRestParameter`

If true, this option allows for the use of rest parameters.

### `allowArgumentsKeyword`

If true, this option allows for the use of the `arguments` keyword.

### `enforceParameterCount`

This option enforces the number of parameters each function takes.

#### false

Don't enforce a parameter count.

#### "atLeastOne"

Require all functions to have a least one parameter.

There's not much point of having a function that doesn't take any parameters in functional programming.

#### "exactlyOne"

Require all functions to have exactly one parameter.

Any function that take takes multiple parameter can be rewritten as a higher-order function that only takes one.

Example:

```ts
// This function
function add(x, y) {
  return x + y;
}

// can be rewritten like this.
function add(x) {
  return y => x + y;
}
```

See [Currying](https://en.wikipedia.org/wiki/Currying) and [Higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) on Wikipedia for more infomation.

#### `enforceParameterCount.count`

See [enforceParameterCount](#enforceparametercount).

#### `enforceParameterCount.ignoreIIFE`

If true, this option allows for the use of [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) that do not have any parameters.

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.
