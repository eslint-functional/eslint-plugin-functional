# Enforce functional parameters (functional-parameters)

Disallow use of rest parameters, the `arguments` keyword and enforces that functions take a least 1 parameter.

## Rule Details

In functions, `arguments` is a special variable that is implicitly available.
This variable is an array containing the arguments passed to the function call and is often used to allow for any number of parameters to be passed to a function. Rest parameters are another way any number of parameters can be passed to a function.

When it comes to functional programming, known and explicit parameters must be used.

Note: With an unknown number of parameters, currying functions is a lot more difficult/impossible.

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/functional-parameters: "error" */

function add() {
  return arguments.reduce((sum, number) => sum + number, 0);
}
```

<!-- eslint-skip -->

```js
/* eslint functional/functional-parameters: "error" */

function add(...numbers) {
  return numbers.reduce((sum, number) => sum + number, 0);
}
```

Examples of **correct** code for this rule:

```js
/* eslint functional/functional-parameters: "error" */

function add(numbers) {
  return numbers.reduce((sum, number) => sum + number, 0);
}
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  allowRestParameter: boolean;
  allowArgumentsKeyword: boolean;
  enforceParameterCount: "atLeastOne" | "exactlyOne" | false | {
    count: "atLeastOne" | "exactlyOne";
    ignoreIIFE: boolean;
  };
  ignorePattern?: string[] | string;
}
```

The default options:

```ts
const defaults = {
  allowRestParameter: false,
  allowArgumentsKeyword: false,
  enforceParameterCount: {
    count: "atLeastOne",
    ignoreIIFE: true
  }
}
```

Note: the `lite` ruleset overrides the default options to:

```ts
const liteDefaults = {
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

<!-- eslint-disable @typescript-eslint/no-redeclare -->

```js
// This function
function add(x, y) {
  return x + y;
}

// can be rewritten like this.
function add(x) {
  return (y) => x + y;
}
```

See [Currying](https://en.wikipedia.org/wiki/Currying) and [Higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) on Wikipedia for more information.

#### `enforceParameterCount.count`

See [enforceParameterCount](#enforceparametercount).

#### `enforceParameterCount.ignoreIIFE`

If true, this option allows for the use of [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) that do not have any parameters.

### `ignorePattern`

Patterns will be matched against function names.
See the [ignorePattern](./options/ignore-pattern.md) docs for more information.
