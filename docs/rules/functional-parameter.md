# Enforce Functional Parameter (functional-parameter)

Disallow use of rest parameters, the `arguments` keyword and enforces that function take a lease 1 parameter.

## Rule Details

In function, `arguments` is a special variable that is implicitly available.
This variable is an array containing the arguments passed to the function call and is often used to allow for any number of parameters to be passed to a function.

Rest parameters are another way any number of parameters can be passed to a function.

When it comes to functional programming, it is better have known and explicit parameters.
Also of note: currying functions is a lot more difficult with an undefined number of parameters.

## Options

The rule accepts an options object with the following properties:

```typescript
type Options = {
  readonly ignorePattern?: string | Array<string>;
  readonly allowRestParameter: boolean;
  readonly allowArgumentsKeyword: boolean;
  readonly enforceParameterCount: false | "atLeastOne" | "exactlyOne";
};

const defaults = {
  allowRestParameter: false,
  allowArgumentsKeyword: false,
  enforceParameterCount: "atLeastOne"
};
```

### `ignorePattern`

See the [ignorePattern](./options/ignore-pattern.md) docs.

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

```typescript
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
