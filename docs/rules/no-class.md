# Disallow classes (no-class)

Disallow use of the `class` keyword.

## Rule Details

Examples of **incorrect** code for this rule:

<!-- eslint-skip -->

```js
/* eslint functional/no-class: "error" */

class Dog {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get ageInDogYears() {
    return 7 * this.age;
  }
}

const dogA = new Dog("Jasper", 2);

console.log(`${dogA.name} is ${dogA.ageInDogYears} in dog years.`);
```

Examples of **correct** code for this rule:

```js
/* eslint functional/no-class: "error" */

function getAgeInDogYears(age) {
  return 7 * age;
}

const dogA = {
  name: "Jasper",
  age: 2,
};

console.log(`${dogA.name} is ${getAgeInDogYears(dogA.age)} in dog years.`);
```

### React Examples

Thanks to libraries like [recompose](https://github.com/acdlite/recompose) and Redux's [React Container components](http://redux.js.org/docs/basics/UsageWithReact.html), there's not much reason to build Components using `React.createClass` or ES6 classes anymore. The `no-this-expression` rule makes this explicit.

```js
const Message = React.createClass({
  render() {
    return <div>{this.props.message}</div>; // <- no this allowed
  },
});
```

Instead of creating classes, you should use React 0.14's [Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.t5z2fdit6) and save yourself some keystrokes:

```js
const Message = ({ message }) => <div>{message}</div>;
```

What about lifecycle methods like `shouldComponentUpdate`? We can use the [recompose](https://github.com/acdlite/recompose) library to apply these optimizations to your Stateless Functional Components. The [recompose](https://github.com/acdlite/recompose) library relies on the fact that your Redux state is immutable to efficiently implement shouldComponentUpdate for you.

```js
import { pure, onlyUpdateForKeys } from "recompose";

const Message = ({ message }) => <div>{message}</div>;

// Optimized version of same component, using shallow comparison of props
// Same effect as React's PureRenderMixin
const OptimizedMessage = pure(Message);

// Even more optimized: only updates if specific prop keys have changed
const HyperOptimizedMessage = onlyUpdateForKeys(["message"], Message);
```

## Options

The rule does not accept any options.
