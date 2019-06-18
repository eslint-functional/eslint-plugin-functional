# tslint-immutable

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

[TSLint](https://palantir.github.io/tslint/) rules to disable mutation in TypeScript.

## Background

In some applications it is important to not mutate any data, for example when using Redux to store state in a React application. Moreover immutable data structures has a lot of advantages in general so I want to use them everywhere in my applications.

I originally used [immutablejs](https://github.com/facebook/immutable-js/) for this purpose. It is a really nice library but I found it had some drawbacks. Specifically when debugging it was hard to see the structure, creating JSON was not straightforward, and passing parameters to other libraries required converting to regular mutable arrays and objects. The [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) project seems to have the same conclusions and they use regular objects and arrays and check for immutability at run-time. This solves all the aformentioned drawbacks but introduces a new drawback of only being enforced at run-time. (Altough you loose the structural sharing feature of immutablejs with this solution so you would have to consider if that is something you need).

Then typescript 2.0 came along and introduced [readonly](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#read-only-properties-and-index-signatures) options for properties, indexers and arrays. This enables us to use regular object and arrays and have the immutability enfored at compile time instead of run-time. Now the only drawback is that there is nothing enforcing the use of readonly in typescript.

This can be solved by using linting rules. So the aim of this project is to leverage the type system in typescript to enforce immutability at compile-time while still using regular objects and arrays.

## Installing

`npm install tslint-immutable --save-dev`

See the [example](#sample-configuration-file) tslint.json file for configuration.

## Compability

* tslint-immutable 5.x.x requires typescript >=2.8, node >=6, and tslint 5.x.x.
* tslint-immutable 3.x.x requires tslint 5.x.x.
* tslint-immutable 2.x.x requires tslint 4.x.x.
* tslint-immutable 1.x.x requires tslint 3.x.x.

## TSLint Rules

In addition to immutable rules this project also contains a few rules for enforcing a functional style of programming. The following rules are available:

* [Immutability rules](#immutability-rules)
  * [readonly-keyword](#readonly-keyword)
  * [readonly-array](#readonly-array)
  * [no-let](#no-let)
  * [no-array-mutation](#no-array-mutation)
  * [no-object-mutation](#no-object-mutation)
  * [no-method-signature](#no-method-signature)
  * [no-delete](#no-delete)
* [Functional style rules](#functional-style-rules)
  * [no-this](#no-this-no-class)
  * [no-class](#no-this-no-class)
  * [no-mixed-interface](#no-mixed-interface)
  * [no-expression-statement](#no-expression-statement)
  * [no-if-statement](#no-if-statement)
  * [no-loop-statement](#no-loop-statement)
  * [no-throw](#no-throw)
  * [no-try](#no-try)
  * [no-reject](#no-reject)
* [Recommended built-in rules](#recommended-built-in-rules)

## Immutability rules

### readonly-keyword

This rule enforces use of the `readonly` modifier. The `readonly` modifier can appear on property signatures in interfaces, property declarations in classes, and index signatures.

Below is some information about the `readonly` modifier and the benefits of using it:

You might think that using `const` would eliminate mutation from your TypeScript code. **Wrong.** Turns out that there's a pretty big loophole in `const`.

```typescript
interface Point {
  x: number;
  y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // This is legal
```

This is why the `readonly` modifier exists. It prevents you from assigning a value to the result of a member expression.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.
```

This is just as effective as using Object.freeze() to prevent mutations in your Redux reducers. However the `readonly` modifier has **no run-time cost**, and is enforced at **compile time**. A good alternative to object mutation is to use the ES2016 object spread [syntax](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#object-spread-and-rest) that was added in typescript 2.1:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
const transformedPoint = { ...point, x: 99 };
```

Note that you can also use object spread when destructuring to [delete keys](http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35676025#35676025) in an object:

```typescript
let { [action.id]: deletedItem, ...rest } = state;
```

The `readonly` modifier also works on indexers:

```typescript
const foo: { readonly [key: string]: number } = { a: 1, b: 2 };
foo["a"] = 3; // Error: Index signature only permits reading
```

#### Has Fixer

Yes

#### Options

* [ignore-local](#using-the-ignore-local-option)
* [ignore-class](#using-the-ignore-class-option)
* [ignore-interface](#using-the-ignore-interface-option)
* [ignore-prefix](#using-the-ignore-prefix-option)
* [ignore-suffix](#using-the-ignore-suffix-option)
* [ignore-pattern](#using-the-ignore-pattern-option)

#### Example config

```javascript
"readonly-keyword": true
```

```javascript
"readonly-keyword": [true, "ignore-local"]
```

```javascript
"readonly-keyword": [true, "ignore-local", {"ignore-prefix": "mutable"}]
```

### readonly-array

This rule enforces use of `ReadonlyArray<T>` or `readonly T[]` instead of `Array<T>` or `T[]`.

Below is some information about the `ReadonlyArray<T>` type and the benefits of using it:

Even if an array is declared with `const` it is still possible to mutate the contents of the array.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
const points: Array<Point> = [{ x: 23, y: 44 }];
points.push({ x: 1, y: 2 }); // This is legal
```

Using the `ReadonlyArray<T>` type or `readonly T[]` will stop this mutation:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const points: ReadonlyArray<Point> = [{ x: 23, y: 44 }];
// const points: readonly Point[] = [{ x: 23, y: 44 }]; // This is the alternative syntax for the line above

points.push({ x: 1, y: 2 }); // Unresolved method push()
```

#### Has Fixer

Yes

#### Options

* [ignore-local](#using-the-ignore-local-option)
* [ignore-prefix](#using-the-ignore-prefix-option)
* [ignore-suffix](#using-the-ignore-suffix-option)
* [ignore-pattern](#using-the-ignore-pattern-option)
* [ignore-return-type](#using-the-ignore-return-type-option)
* [ignore-rest-parameters](#using-the-ignore-rest-parameters-option)

#### Example config

```javascript
"readonly-array": true
```

```javascript
"readonly-array": [true, "ignore-local"]
```

```javascript
"readonly-array": [true, "ignore-local", {"ignore-prefix": "mutable"}]
```

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
    {results.map(result => <li>result</li>) // <- Who needs let?
    }
  </ul>
);
```

#### Has Fixer

Yes

#### Options

* [ignore-local](#using-the-ignore-local-option)
* [ignore-prefix](#using-the-ignore-prefix-option)
* [ignore-suffix](#using-the-ignore-suffix-option)
* [ignore-pattern](#using-the-ignore-pattern-option)

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

* [ignore-prefix](#using-the-ignore-prefix-option)
* [ignore-suffix](#using-the-ignore-suffix-option)
* [ignore-pattern](#using-the-ignore-pattern-option)
* [ignore-new-array](#using-the-ignore-new-array-option-with-no-array-mutation)
* ~~ignore-mutation-following-accessor~~ - _deprecated in favor of [ignore-new-array](#using-the-ignore-new-array-option-with-no-array-mutation)_

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

* [ignore-prefix](#using-the-ignore-prefix-option)
* [ignore-suffix](#using-the-ignore-suffix-option)
* [ignore-pattern](#using-the-ignore-pattern-option)

#### Example config

```javascript
"no-object-mutation": true
```

```javascript
"no-object-mutation": [true, {"ignore-prefix": "mutable"}]
```

### no-method-signature

There are two ways function members can be declared in an interface or type alias:

```typescript
interface Zoo {
  foo(): string; // MethodSignature, cannot have readonly modifier
  readonly bar: () => string; // PropertySignature
}
```

The `MethodSignature` and the `PropertySignature` forms seem equivalent, but only the `PropertySignature` form can have a `readonly` modifier. Becuase of this any `MethodSignature` will be mutable. Therefore the `no-method-signature` rule disallows usage of this form and instead proposes to use the `PropertySignature` which can have a `readonly` modifier. It should be noted however that the `PropertySignature` form for declaring functions does not support overloading.

### no-delete

The delete operator allows for mutating objects by deleting keys. This rule disallows any delete expressions.

```typescript
delete object.property; // Unexpected delete, objects should be considered immutable.
```

As an alternative the spread operator can be used to delete a key in an object (as noted [here](https://stackoverflow.com/a/35676025/2761797)):

```typescript
const { [action.id]: deletedItem, ...rest } = state;
```

## Functional style rules

### no-this, no-class

Thanks to libraries like [recompose](https://github.com/acdlite/recompose) and Redux's [React Container components](http://redux.js.org/docs/basics/UsageWithReact.html), there's not much reason to build Components using `React.createClass` or ES6 classes anymore. The `no-this` rule makes this explicit.

```typescript
const Message = React.createClass({
  render: function() {
    return <div>{this.props.message}</div>; // <- no this allowed
  }
});
```

Instead of creating classes, you should use React 0.14's [Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.t5z2fdit6) and save yourself some keystrokes:

```typescript
const Message = ({ message }) => <div>{message}</div>;
```

What about lifecycle methods like `shouldComponentUpdate`? We can use the [recompose](https://github.com/acdlite/recompose) library to apply these optimizations to your Stateless Functional Components. The [recompose](https://github.com/acdlite/recompose) library relies on the fact that your Redux state is immutable to efficiently implement shouldComponentUpdate for you.

```typescript
import { pure, onlyUpdateForKeys } from "recompose";

const Message = ({ message }) => <div>{message}</div>;

// Optimized version of same component, using shallow comparison of props
// Same effect as React's PureRenderMixin
const OptimizedMessage = pure(Message);

// Even more optimized: only updates if specific prop keys have changed
const HyperOptimizedMessage = onlyUpdateForKeys(["message"], Message);
```

### no-mixed-interface

Mixing functions and data properties in the same interface is a sign of object-orientation style. This rule enforces that an inteface only has one type of members, eg. only data properties or only functions.

### no-expression-statement

When you call a function and don’t use it’s return value, chances are high that it is being called for its side effect. e.g.

```typescript
array.push(1);
alert("Hello world!");
```

This rule checks that the value of an expression is assigned to a variable and thus helps promote side-effect free (pure) functions.

#### Options

* [ignore-prefix](#using-the-ignore-prefix-option-with-no-expression-statement)

#### Example config

```javascript
"no-expression-statement": true
```

```javascript
"no-expression-statement": [true, {"ignore-prefix": "console."}]
```

```javascript
"no-expression-statement": [true, {"ignore-prefix": ["console.log", "console.error"]}]
```

### no-if-statement

If statements is not a good fit for functional style programming as they are not expresssions and do not return a value. This rule disallows if statements.

```typescript
let x;
if (i === 1) {
  x = 2;
} else {
  x = 3;
}
```

Instead consider using the [tenary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) which is an expression that returns a value:

```typescript
const x = i === 1 ? 2 : 3;
```

For more background see this [blog post](https://hackernoon.com/rethinking-javascript-the-if-statement-b158a61cd6cb) and discussion in [#54](https://github.com/jonaskello/tslint-immutable/issues/54).

### no-loop-statement

In functional programming we want everthing to be an expression that returns a value. Loops in typescript are statements so they are not a good fit for a functional programming style. This rule disallows for loop statements, including `for`, `for...of`, `for...in`, `while`, and `do...while`.

```typescript
const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double[i] = numbers[i] * 2;
}
```

Instead consider using `map` or `reduce`:

```typescript
const numbers = [1, 2, 3];
const double = numbers.map(n => n * 2);
```

For more background see this [blog post](https://hackernoon.com/rethinking-javascript-death-of-the-for-loop-c431564c84a8) and discussion in [#54](https://github.com/jonaskello/tslint-immutable/issues/54).

### no-throw

Exceptions are not part of functional programming.

```typescript
throw new Error("Something went wrong."); // Unexpected throw, throwing exceptions is not functional.
```

As an alternative a function should return an error:

```typescript
function divide(x: number, y: number): number | Error {
  return y === 0 ? new Error("Cannot divide by zero.") : x / y;
}
```

Or in the case of an async function, a rejected promise should be returned.

```typescript
async function divide(x: Promise<number>, y: Promise<number>): Promise<number> {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}
```

### no-try

Try statements are not part of functional programming. See [no-throw](#no-throw) for more information.

### no-reject

You can view a `Promise` as a result object with built-in error (something like `{ value: number } | { error: Error }`) in which case a rejected `Promise` can be viewed as a returned result and thus fits with functional programming. You can also view a rejected promise as something similar to an exception and as such something that does not fit with functional programming. If your view is the latter you can use the `no-reject` rule to disallow rejected promises.

```typescript
async function divide(
  x: Promise<number>,
  y: Promise<number>
): Promise<number | Error> {
  const [xv, yv] = await Promise.all([x, y]);

  // Rejecting the promise is not allowed so resolve to an Error instead

  // return yv === 0
  //   ? Promise.reject(new Error("Cannot divide by zero."))
  //   : xv / yv;

  return yv === 0 ? new Error("Cannot divide by zero.") : xv / yv;
}
```

## Options

### Using the `ignore-local` option

> If a tree falls in the woods, does it make a sound?
> If a pure function mutates some local data in order to produce an immutable return value, is that ok?

The quote above is from the [clojure docs](https://clojure.org/reference/transients). In general, it is more important to enforce immutability for state that is passed in and out of functions than for local state used for internal calculations within a function. For example in Redux, the state going in and out of reducers needs to be immutable while the reducer may be allowed to mutate local state in its calculations in order to achieve higher performance. This is what the `ignore-local` option enables. With this option enabled immutability will be enforced everywhere but in local state. Function parameters and return types are not considered local state so they will still be checked.

Note that using this option can lead to more imperative code in functions so use with care!

### Using the `ignore-class` option

Doesn't check for `readonly` in classes.

### Using the `ignore-interface` option

Doesn't check for `readonly` in interfaces.

### Using the `ignore-rest-parameters` option

Doesn't check for `ReadonlyArray` for function rest parameters.

### Using the `ignore-return-type` option

Doesn't check the return type of functions.

### Using the `ignore-prefix` option

Some languages are immutable by default but allows you to explicitly declare mutable variables. For example in [reason](https://facebook.github.io/reason/) you can declare mutable record fields like this:

```reason
type person = {
  name: string,
  mutable age: int
};
```

Typescript is not immutable by default but it can be if you use this package. So in order to create an escape hatch similar to how it is done in reason the `ignore-prefix` option can be used. For example if you configure it to ignore variables with names that has the prefix "mutable" you can emulate the above example in typescript like this:

```typescript
type person = {
  readonly name: string;
  mutableAge: number; // This is OK with ignore-prefix = "mutable"
};
```

Yes, variable names like `mutableAge` are ugly, but then again mutation is an ugly business :-).

### Using the `ignore-suffix` option

Like ignore-prefix but with suffix matching instead of prefix matching.

### Using the `ignore-pattern` option

Like ignore-prefix and ignore-suffix but with more control.

This option allows you to specify dot seperated paths what should be ignored.

For example, the following config would ignore all object mutations for all properties that start with "mutable".

```json
{
  "no-object-mutation": [true, { "ignore-pattern": "**.mutable*" }]
}
```

The following wildcards can be used when specifing a pattern:

* `**` - Match any depth (including zero). Can only be used as a full accessor.
* `*`  - When used as a full accessor, match the next accessor. When used as part of an accessor, match any characters.

### Using the `ignore-prefix` option with `no-expression-statement`

Expression statements typically cause side effects, however not all side effects are undesirable. One example of a helpful side effect is logging. To not get warning of every log statement, we can configure the linter to ignore well known expression statement prefixes.

One such prefix could be `console.`, which would cover both these cases:

```typescript
const doSomething(arg:string) => {
  if (arg) {
    console.log("Argument is", arg);
  } else {
    console.warn("Argument is empty!");
  }
  return `Hello ${arg}`;
}
```

### Using the `ignore-new-array` option with `no-array-mutation`

This option allows for the use of array mutator methods to be chained to newly created arrays.

For example, an array can be immutably sorted like so:

```typescript
const original = ["foo", "bar", "baz"];
const sorted = original.slice().sort((a, b) => a.localeCompare(b)); // This is OK with ignore-new-array - note the use of the `slice` method which returns a copy of the original array.
```

## Recommended built-in rules

### [no-var-keyword](https://palantir.github.io/tslint/rules/no-var-keyword/)

Without this rule, it is still possible to create `var` variables that are mutable.

### [no-parameter-reassignment](https://palantir.github.io/tslint/rules/no-parameter-reassignment/)

Without this rule, function parameters are mutable.

### [typedef](https://palantir.github.io/tslint/rules/typedef/) with call-signature option

For performance reasons, tslint-immutable does not check implicit return types. So for example this function will return an mutable array but will not be detected (see [#18](https://github.com/jonaskello/tslint-immutable/issues/18) for more info):

```javascript
function foo() {
  return [1, 2, 3];
}
```

To avoid this situation you can enable the built in typedef rule like this:

`"typedef": [true, "call-signature"]`

Now the above function is forced to declare the return type becomes this and will be detected.

## Sample Configuration File

Here's a sample TSLint configuration file (tslint.json) that activates all the rules:

```javascript
{
  "extends": ["tslint-immutable"],
  "rules": {

    // Recommended built-in rules
    "no-var-keyword": true,
    "no-parameter-reassignment": true,
    "typedef": [true, "call-signature"],

    // Immutability rules
    "readonly-keyword": true,
    "readonly-array": true,
    "no-let": true,
    "no-object-mutation": true,
    "no-delete": true,
    "no-method-signature": true,

    // Functional style rules
    "no-this": true,
    "no-class": true,
    "no-mixed-interface": true,
    "no-expression-statement": true,
    "no-if-statement": true

  }
}
```

It is also possible to enable all the rules in tslint-immutable by extending `tslint-immutable/all` like this:

```javascript
{
  "extends": ["tslint-immutable/all"]
}
```

## How to contribute

For new features file an issue. For bugs, file an issue and optionally file a PR with a failing test. Tests are really easy to do, you just have to edit the `*.ts.lint` files under the test directory. Read more here about [tslint testing](https://palantir.github.io/tslint/develop/testing-rules/).

## How to develop

To execute the tests first run `yarn build` and then run `yarn test`.

While working on the code you can run `yarn test:work`. This script also builds before running the tests. To run a subset of the tests, change the path for `yarn test:work` in `package.json`.

Please review the [tslint performance tips](https://palantir.github.io/tslint/develop/custom-rules/performance-tips.html) in order to write rules that run efficiently at run-time. For example, note that using `SyntaxWalker` or any subclass thereof like `RuleWalker` is inefficient. Note that tslint requires the use of `class` as an entrypoint, but you can make a very small class that inherits from `AbstractRule` which directly calls `this.applyWithFunction` and from there you can switch to using a more functional programming style.

In order to know which AST nodes are created for a snippet of typescript code you can use [ast explorer](https://astexplorer.net/).

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

## Prior work

This work was originally inspired by [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

[version-image]: https://img.shields.io/npm/v/tslint-immutable.svg?style=flat
[version-url]: https://www.npmjs.com/package/tslint-immutable
[travis-image]: https://travis-ci.com/jonaskello/tslint-immutable.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/jonaskello/tslint-immutable
[codecov-image]: https://codecov.io/gh/jonaskello/tslint-immutable/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/jonaskello/tslint-immutable
[license-image]: https://img.shields.io/github/license/jonaskello/tslint-immutable.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[type-info-badge]: https://img.shields.io/badge/type_info-required-d51313.svg?style=flat
[type-info-url]: https://palantir.github.io/tslint/usage/type-checking
